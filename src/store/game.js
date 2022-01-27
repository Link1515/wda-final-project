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
    addList (state, newData) {
      state[newData.listKey].push({
        id: Date.now(),
        role: newData.name,
        description: newData.description || '無描述'
      })
    },
    removeList (state, removeData) {
      state[removeData.listKey] = state[removeData.listKey].filter(item => item.role !== removeData.value)
    },
    setFunRoleState (state, enableFunRole) {
      state.enableFunRole = enableFunRole
    }
  },
  actions: {

  }
}
