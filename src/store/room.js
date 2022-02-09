export default {
  namespaced: true,
  state: {
    roomId: '',
    playerAmount: 0,
    joinedPlayerAmount: 1,
    playerList: []
  },
  mutations: {
    roomSetting (state, { roomId, playerAmount }) {
      state.roomId = roomId
      state.playerAmount = playerAmount
    }
  }
}
