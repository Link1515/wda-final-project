import swal from 'sweetalert2'
import { roleListNameTranslator, roleNameTranslator } from '@/functions/idTranslator.js'
import { getVoices } from '@/functions/getVoices.js'

export default {
  namespaced: true,
  state: {
    startState: false,
    roomId: '',
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
      state.gameInfo = {}
      state.playerAmount = 0
      state.joinedPlayerAmount = 1
      state.playerList = []
      state.msg = null
    },
    start (state, startState) {
      state.startState = startState
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
