import router from '../router'
import vm from '@/main.js'
import swal from 'sweetalert2'
import { roleListNameTranslator, roleNameTranslator } from '@/functions/idTranslator.js'
import { getVoices } from '@/functions/getVoices.js'

export default {
  namespaced: true,
  state: {
    startState: false,
    roomId: '',
    socketId: '',
    gameInfo: {},
    playerAmount: 0,
    joinedPlayerAmount: 1,
    playerList: [],
    msg: null
  },
  mutations: {
    reset (state) {
      state.startState = false
      state.roomId = ''
      state.socketId = ''
      state.gameInfo = {}
      state.playerAmount = 0
      state.joinedPlayerAmount = 1
      state.playerList = []
      state.msg = null
    },
    start (state, startState) {
      state.startState = startState
    },
    back (state) {
      state.startState = false
    },
    async SOCKET_joinRoomSuccess (state, { roomId, gameInfo, playerAmount, socketId }) {
      state.roomId = roomId
      state.socketId = socketId
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
    },
    SOCKET_refresh () {
      vm.$socket.disconnect()
      router.push('/play')
      swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '連線中斷'
      })
    }
  },
  actions: {
    SOCKET_excludePlayer ({ state, commit }, socketId) {
      if (socketId === state.socketId) {
        vm.$socket.disconnect()
        router.push('/play')
        commit('reset')
        swal.fire({
          icon: 'error',
          title: '錯誤',
          text: '已被房主踢出'
        })
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
    playerData (state) {
      return state.playerList.filter(player => player.socketId === state.socketId)[0]
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
    },
    stepListDisplayHelper (state) {
      if (!state.gameInfo.stepList) return

      const newStepList = JSON.parse(JSON.stringify(state.gameInfo.stepList))

      newStepList.forEach(step => {
        step.rules.forEach(rule => {
          switch (rule.mode) {
            case '語音':
              rule.iconType = 'pi pi-volume-up'
              rule.iconColor = '#EED19C'
              break
            case '計時':
              rule.iconType = 'pi pi-clock'
              rule.iconColor = '#7AD4CB'
              break
            case '顯示':
              rule.iconType = 'pi pi-eye'
              rule.iconColor = '#ACBA9D'
              rule.conductingRoleListName = roleListNameTranslator(rule.data.conductingRoleListType)
              rule.conductingRoleName = roleNameTranslator(state.gameInfo, rule.data.conductingRoleListType, rule.data.conductingRoleId)
              rule.roleListName = roleListNameTranslator(rule.data.roleListType)
              rule.roleName = roleNameTranslator(state.gameInfo, rule.data.roleListType, rule.data.roleId)
              break
            case '查驗':
              rule.iconType = 'pi pi-search'
              rule.iconColor = '#749D9B'
              rule.conductingRoleListName = roleListNameTranslator(rule.data.conductingRoleListType)
              rule.conductingRoleName = roleNameTranslator(state.gameInfo, rule.data.conductingRoleListType, rule.data.conductingRoleId)
              break
            case '標記':
              rule.iconType = 'pi pi-user-edit'
              rule.iconColor = '#E8837E'
              rule.conductingRoleListName = roleListNameTranslator(rule.data.conductingRoleListType)
              rule.conductingRoleName = roleNameTranslator(state.gameInfo, rule.data.conductingRoleListType, rule.data.conductingRoleId)
              break
            case '多選一':
              rule.iconType = 'pi pi-sitemap'
              rule.iconColor = '#E2BFE7'
              rule.conductingRoleListName = roleListNameTranslator(rule.data.conductingRoleListType)
              rule.conductingRoleName = roleNameTranslator(state.gameInfo, rule.data.conductingRoleListType, rule.data.conductingRoleId)
              break
          }
        })
      })
      return newStepList
    }
  }
}
