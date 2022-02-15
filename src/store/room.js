import swal from 'sweetalert2'
import vm from '../main.js'

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
      const voices = await getVoices()
      const voiceType = voices.filter(v => v.name.includes(state.gameInfo.voiceType))[0]
      state.msg = new SpeechSynthesisUtterance()
      state.msgmsg.voice = voiceType
      state.roomId = roomId
      state.gameInfo = gameInfo
      state.playerAmount = playerAmount
    },
    SOCKET_updateRoomData (state, { joinedPlayerAmount, playerList }) {
      state.joinedPlayerAmount = joinedPlayerAmount
      state.playerList = playerList
    }
  },
  actions: {
    async SOCKET_runStep ({ state }) {
      const stepList = state.gameInfo.stepList
      for (let i = 0; i < stepList.length; i++) {
        switch (stepList[i].mode) {
          case '語音':
            await stepVoice(state.msg, stepList[i])
            break
          case '顯示':
            await stepShow(stepList[i], stepList[i].data.timer * 1000)
            break
          case '標記':
            await stepMark()
            break
        }
      }
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

function stepVoice (msg, step) {
  return new Promise((resolve, reject) => {
    msg.onend = resolve
    msg.text = step.data
    speechSynthesis.speak(msg)
  })
}

function stepShow (step, timer) {
  return new Promise((resolve, reject) => {
    let timerInterval
    swal.fire({
      html: `
        <div id="timeBar" style="background: blue; height: 5px"></div>
      `,
      timer,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        const timeBar = swal.getHtmlContainer().querySelector('#timeBar')
        timerInterval = setInterval(() => {
          timeBar.style.width = parseInt((swal.getTimerLeft() / timer) * 100) + '%'
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then(() => {
      console.log('顯示成功')
      resolve()
    })
  })
}

function stepMark () {
  return new Promise((resolve, reject) => {
    swal.fire({
      text: '標記'
    }).then(() => {
      vm.$socket.emit('test', 'test')
      console.log('標記成功')
      resolve()
    })
  })
}
