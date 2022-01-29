import { nanoid } from 'nanoid'

export default {
  namespaced: true,
  state: {
    name: '',
    playerRange: [3, 8],
    goodCompRoleList: [],
    badCompRoleList: [],
    enableFunRole: false,
    funRoleList: [],
    stepList: [],
    savedInServer: false
  },
  mutations: {
    setName (state, newName) {
      state.name = newName
    },
    setPlayerRange (state, newPlayerRange) {
      state.playerRange = newPlayerRange
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
    }
  },
  actions: {

  }
}
