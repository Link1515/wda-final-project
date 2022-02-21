import swal from 'sweetalert2'
import { nanoid } from 'nanoid'
import { serverAPI } from '../plugins/Axios.js'
import router from '../router'

export default {
  namespaced: true,
  state: {
    _id: '',
    name: '',
    description: '',
    image: '',
    author: '',
    playerRange: [3, 8],
    goodCampRoleList: [],
    badCampRoleList: [],
    enableFunRole: false,
    funRoleList: [],
    stepList: [{ id: nanoid(), name: '第一夜', rules: [] }],
    voiceType: 'Google 國語'
  },
  mutations: {
    reset (state) {
      state._id = ''
      state.name = ''
      state.description = ''
      state.image = ''
      state.author = ''
      state.playerRange = [3, 8]
      state.goodCampRoleList = []
      state.badCampRoleList = []
      state.enableFunRole = false
      state.funRoleList = []
      state.stepList = [{ id: nanoid(), name: '第一夜', rules: [] }]
      state.voiceType = 'Google 國語'
    },
    update (state, newData) {
      state._id = newData._id
      state.name = newData.name
      state.description = newData.description
      state.image = newData.image
      state.author = newData.author
      state.playerRange = newData.playerRange
      state.goodCampRoleList = newData.goodCampRoleList
      state.badCampRoleList = newData.badCampRoleList
      state.enableFunRole = newData.enableFunRole
      state.funRoleList = newData.funRoleList
      state.stepList = newData.stepList
      state.voiceType = newData.voiceType
    },

    setName (state, newName) {
      state.name = newName
    },
    setDescription (state, newDescription) {
      state.description = newDescription
    },
    setPlayerRange (state, newPlayerRange) {
      state.playerRange = newPlayerRange
    },
    setImage (state, newImage) {
      state.image = newImage
    },

    addRoleList (state, { listType, name, description }) {
      state[listType].push({
        id: nanoid(),
        name,
        description: description,
        isEditing: false
      })
    },
    removeRoleList (state, { listType, target }) {
      state[listType] = state[listType].filter(role => role.id !== target)
      state.stepList = state.stepList.filter(step => step.data.roleId !== target)
    },
    editRoleList (state, { listType, target }) {
      if (target) {
        for (const role of state[listType]) {
          if (role.id === target) {
            role.isEditing = !role.isEditing
            break
          }
        }
      } else {
        for (const role of state[listType]) {
          if (role.isEditing === true) {
            role.isEditing = false
            break
          }
        }
      }
    },
    updateRoleList (state, { listType, target, name, description }) {
      for (const role of state[listType]) {
        if (role.id === target) {
          role.name = name
          role.description = description
          role.isEditing = false
          break
        }
      }
    },
    setFunRoleState (state, enableFunRole) {
      state.enableFunRole = enableFunRole
    },

    createStepList (state) {
      state.stepList.push({ id: nanoid(), name: '新增流程', rules: [] })
    },
    addStepList (state, { stepListIndex, mode, data }) {
      state.stepList[stepListIndex].rules.push({
        id: nanoid(),
        mode,
        data
      })
    },
    updateStepList (state, newOrderSetp) {
      state.stepList = newOrderSetp
    },
    deleteStepList (state, index) {
      state.stepList.splice(index, 1)
    },

    updateVoiceType (state, newVoiceType) {
      state.voiceType = newVoiceType
    }
  },
  actions: {
    async editGameFinish ({ rootState, commit }) {
      try {
        const fd = new FormData()
        for (const key in rootState.game) {
          if (key !== '_id') {
            if (key.includes('List') || key === 'playerRange') {
              fd.append(key, JSON.stringify(rootState.game[key]))
            } else {
              fd.append(key, rootState.game[key])
            }
          }
        }

        if (!rootState.game._id.length) {
          await serverAPI.post('/games/create', fd, {
            headers: {
              authorization: 'Bearer ' + rootState.user.token
            }
          })
        } else {
          fd.append('_id', rootState.game._id)
          await serverAPI.patch('/games/update', fd, {
            headers: {
              authorization: 'Bearer ' + rootState.user.token
            }
          })
        }

        swal.fire({
          icon: 'success',
          title: '成功'
        }).then(() => {
          commit('reset')
          router.push('/makegame')
        })
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '失敗',
          text: '製作桌遊失敗'
        })
      }
    },

    async getOneGame ({ rootState, commit }, gameId) {
      try {
        const { data } = await serverAPI.get('/games/getGameById/' + gameId, {
          headers: {
            authorization: 'Bearer ' + rootState.user.token
          }
        })
        commit('update', data.result)
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '失敗'
        })
      }
    }
  },
  getters: {
    stepListDisplayHelper (state) {
      const newStepList = JSON.parse(JSON.stringify(state.stepList))

      newStepList.forEach(step => {
        step.rules.forEach(rule => {
          switch (rule.mode) {
            case '語音':
              rule.iconType = 'pi pi-volume-up'
              rule.iconColor = '#EED19C'
              break
            case '顯示':
              rule.iconType = 'pi pi-eye'
              rule.iconColor = '#ACBA9D'
              rule.conductingRoleListName = roleListNameTranslator(rule.data.conductingRoleListType)
              rule.conductingRoleName = roleNameTranslator(state, rule.data.conductingRoleListType, rule.data.conductingRoleId)
              rule.roleListName = roleListNameTranslator(rule.data.roleListType)
              rule.roleName = roleNameTranslator(state, rule.data.roleListType, rule.data.roleId)
              break
            case '查驗':
              rule.iconType = 'pi pi-search'
              rule.iconColor = '#749D9B'
              rule.conductingRoleListName = roleListNameTranslator(rule.data.conductingRoleListType)
              rule.conductingRoleName = roleNameTranslator(state, rule.data.conductingRoleListType, rule.data.conductingRoleId)
              break
            case '標記':
              rule.iconType = 'pi pi-user-edit'
              rule.iconColor = '#E8837E'
              rule.conductingRoleListName = roleListNameTranslator(rule.data.conductingRoleListType)
              rule.conductingRoleName = roleNameTranslator(state, rule.data.conductingRoleListType, rule.data.conductingRoleId)
              break
          }
        })
      })
      return newStepList
    },
    test (state) {
      return { ...state }
    }
  }
}

function roleListNameTranslator (roleListType) {
  switch (roleListType) {
    case 'goodCampRoleList':
      return '好人陣營'
    case 'badCampRoleList':
      return '壞人陣營'
    case 'funRoleList':
      return '功能身分'
  }
}

function roleNameTranslator (state, roleListType, roleId) {
  if (roleId === 'all') return '全部'
  const result = state[roleListType].filter(role => role.id === roleId)[0]
  if (!result) return 'error: 角色不存在'
  return result.name
}
