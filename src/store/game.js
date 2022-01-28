export default {
  namespaced: true,
  state: {
    name: '',
    playerRange: [3, 8],
    goodCompList: [],
    badCompList: [],
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
    addList (state, { listType, name, description }) {
      state[listType].push({
        id: Date.now().toString(),
        name,
        description: description || '無描述',
        isEditing: false
      })
    },
    removeList (state, { listType, target }) {
      state[listType] = state[listType].filter(role => role.id !== target)
    },
    editList (state, { listType, target }) {
      for (const role of state[listType]) {
        if (role.id === target) {
          role.isEditing = !role.isEditing
        } else {
          role.isEditing = false
        }
      }
    },
    updateList (state, { listType, target, name, description }) {
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
    }
  },
  actions: {

  }
}
