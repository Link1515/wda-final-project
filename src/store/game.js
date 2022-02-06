import swal from 'sweetalert2'
import { nanoid } from 'nanoid'
import { serverAPI } from '../plugins/Axios.js'

export default {
  namespaced: true,
  state: {
    _id: '',
    name: '',
    description: '',
    image: '',
    author: '',
    playerRange: [3, 8],
    goodCompRoleList: [],
    badCompRoleList: [],
    enableFunRole: false,
    funRoleList: [],
    stepList: [],
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
      state.goodCompRoleList = []
      state.badCompRoleList = []
      state.enableFunRole = false
      state.funRoleList = []
      state.stepList = []
      state.voiceType = 'Google 國語'
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

    addStepList (state, { mode, data }) {
      state.stepList.push({
        id: nanoid(),
        mode,
        data
      })
    },
    updateStepList (state, newOrderSetp) {
      state.stepList = newOrderSetp
    },

    updateVoiceType (state, newVoiceType) {
      state.voiceType = newVoiceType
    }
  },
  actions: {
    async createGame ({ rootState }) {
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

        await serverAPI.post('/games/create', fd, {
          headers: {
            authorization: 'Bearer ' + rootState.user.token
          }
        })
        swal.fire({
          icon: 'success',
          title: '成功',
          text: '創建桌遊成功'
        })
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: '失敗',
          text: '創建桌遊失敗'
        })
      }
    }
  },
  getters: {
    stepListDisplayHelper (state) {
      const newStepList = JSON.parse(JSON.stringify(state.stepList))

      newStepList.forEach(step => {
        switch (step.mode) {
          case '語音':
            step.iconType = 'pi pi-volume-up'
            step.iconColor = '#EED19C'
            break
          case '顯示':
            step.iconType = 'pi pi-eye'
            step.iconColor = '#ACBA9D'
            step.roleListName = roleListNameTranslator(step.data.roleListType)
            step.roleName = roleNameTranslator(state, step.data.roleListType, step.data.roleId)
            break
          case '標記':
            step.iconType = 'pi pi-user-edit'
            step.iconColor = '#E8837E'
            step.conductingRoleListName = roleListNameTranslator(step.data.conductingRoleListType)
            step.conductingRoleName = roleNameTranslator(state, step.data.conductingRoleListType, step.data.conductingRoleId)
            break
        }
      })
      return newStepList
    }
  }
}

function roleListNameTranslator (roleListType) {
  switch (roleListType) {
    case 'goodCompRoleList':
      return '好人陣營'
    case 'badCompRoleList':
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
