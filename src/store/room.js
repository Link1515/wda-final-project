import swal from 'sweetalert2'

export default {
  namespaced: true,
  state: {
    roomId: '',
    gameInfo: {},
    playerAmount: 0,
    joinedPlayerAmount: 1,
    playerList: [],
    msg: null
  },
  mutations: {
    reset (state) {
      state.roomId = ''
      state.gameInfo = {}
      state.playerAmount = 0
      state.joinedPlayerAmount = 1
      state.playerList = []
      state.msg = null
    },
    async SOCKET_joinRoomSuccess (state, { roomId, gameInfo, playerAmount }) {
      state.roomId = roomId
      state.gameInfo = gameInfo
      state.playerAmount = playerAmount

      const voices = await getVoices()
      const voiceType = voices.filter(v => v.name.includes(state.gameInfo.voiceType))[0]
      state.msg = new SpeechSynthesisUtterance()
      state.msg.voice = voiceType
    },
    SOCKET_updateRoomData (state, { joinedPlayerAmount, playerList }) {
      state.joinedPlayerAmount = joinedPlayerAmount
      state.playerList = playerList
    }
  },
  actions: {
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
function getVoices () {
  return new Promise(
    function (resolve, reject) {
      const synth = window.speechSynthesis

      const id = setInterval(() => {
        if (synth.getVoices().length !== 0) {
          resolve(synth.getVoices())
          clearInterval(id)
        }
      }, 10)
    }
  )
}
