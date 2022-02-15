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
    async SOCKET_runStep ({ state }, gameStep) {
      const stepList = state.gameInfo.stepList
      let showPlayers

      switch (stepList[gameStep].mode) {
        case '語音':
          await stepVoice(state.msg, stepList[gameStep])
          break
        case '顯示':
          if (stepList[gameStep].data.roleListType === 'all') {
            showPlayers = state.playerList
          } else if (stepList[gameStep].data.roleListType === 'funRoleList') {
            showPlayers = state.playerList.filter(player => player.funRoleId === stepList[gameStep].data.roleId)
          } else if (stepList[gameStep].data.roleListType === 'goodCampRoleList') {
            if (stepList[gameStep].data.roleId === 'all') {
              showPlayers = state.playerList.filter(player => player.camp === true)
            } else {
              showPlayers = state.playerList.filter(player => player.campRoleId === stepList[gameStep].data.roleId)
            }
          } else if (stepList[gameStep].data.roleListType === 'badCampRoleList') {
            if (stepList[gameStep].data.roleId === 'all') {
              showPlayers = state.playerList.filter(player => player.camp === false)
            } else {
              showPlayers = state.playerList.filter(player => player.campRoleId === stepList[gameStep].data.roleId)
            }
          }
          await stepShow(showPlayers, stepList[gameStep].data.timer * 1000)
          break
        case '標記':
          await stepMark()
          break
      }
      vm.$socket.emit('stepDone')
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

function stepShow (showPlayers, timer) {
  return new Promise((resolve, reject) => {
    let timerInterval
    let playersHtml = ''

    showPlayers.map(player => {
      playersHtml += `<div class="col-3">${player.name}</div>`
    })

    const html = `
      <div id="timeBar" style="background: blue; height: 5px"></div>
      <div class="row flex-wrap justify-content-center" style="width: 100%">${playersHtml}</div>
    `
    swal.fire({
      html,
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
