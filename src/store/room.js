export default {
  namespaced: true,
  state: {
    roomId: '',
    playerAmount: 0,
    joinedPlayerAmount: 1,
    playerList: []
  },
  mutations: {
    SOCKET_joinRoomSuccess (state, { roomId, playerAmount }) {
      state.roomId = roomId
      state.playerAmount = playerAmount
    },
    SOCKET_updateRoomData (state, { joinedPlayerAmount }) {
      state.joinedPlayerAmount = joinedPlayerAmount
    }
  }
}
