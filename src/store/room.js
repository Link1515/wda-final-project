import swal from 'sweetalert2'

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
    SOCKET_updateRoomData (state, { joinedPlayerAmount, playerList }) {
      state.joinedPlayerAmount = joinedPlayerAmount
      state.playerList = playerList
    },
    SOCKET_error (_, msg) {
      swal.fire({
        icon: 'error',
        title: '錯誤',
        text: msg
      })
    }
  },
  getters: {
    playerData (state, _, rootState) {
      return state.playerList.filter(player => player.playerId === rootState.user._id)[0]
    },
    everyoneReady (state) {
      let everyoneReady = true

      if (state.joinedPlayerAmount !== state.playerAmount) {
        everyoneReady = false
        return everyoneReady
      }

      for (const player of state.playerList) {
        if (!player.ready) {
          everyoneReady = false
          break
        }
      }

      return everyoneReady
    }
  }
}
