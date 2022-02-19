<template>
  <div id="start" class="viewBox routerviewHeight">
    <div class="subViewBox">
      <TabView>
        <TabPanel header="在線玩家">
          <DataTable stripedRows :value="playerList" class="mb-3">
            <Column field="role" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <FontAwesomeIcon v-if="slotProps.data.role === 1" :icon="['fas','crown']" style="color: #fa0"></FontAwesomeIcon>
              </template>
            </Column>
            <Column field="name" header="玩家頭像" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <Avatar v-if="slotProps.data.avatar" :image="slotProps.data.avatar" size="large" shape="circle"/>
                <Avatar v-else icon="pi pi-user" size="large" shape="circle"/>
              </template>
            </Column>
            <Column field="name" header="玩家暱稱" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <span :class="{ self: $socket.id === slotProps.data.socketId }">{{ slotProps.data.name }}</span>
              </template>
            </Column>
          </DataTable>
          <div style="text-align: center">
            <Button label="離開房間" @click="leaveRoom" class="p-button-rounded p-button-raised p-button-danger"/>
          </div>
        </TabPanel>
        <TabPanel header="遊戲流程">
          <DataTable stripedRows :value="gameInfo.stepList">
            <Column :bodyStyle="{ textAlign: 'center', justifyContent: 'center' }">
              <template #body="slotProps">
                <span v-if="slotProps.data.mode === '語音'">
                  {{ slotProps.data.data }}
                </span>
                <span v-else-if="slotProps.data.mode === '顯示'">
                  {{ translateRoleType(slotProps.data.data.conductingRoleListType) }} {{translateRoleName(slotProps.data.data.conductingRoleListType, slotProps.data.data.conductingRoleId)}} 執行顯示 {{ translateRoleType(slotProps.data.data.roleListType) }} {{translateRoleName(slotProps.data.data.roleListType, slotProps.data.data.roleId)}}，時間 {{slotProps.data.data.timer}} 秒
                </span>
                <span v-else-if="slotProps.data.mode === '標記'">
                  {{ translateRoleType(slotProps.data.data.conductingRoleListType) }} {{translateRoleName(slotProps.data.data.conductingRoleListType, slotProps.data.data.conductingRoleId)}} 執行標記，時間 {{slotProps.data.data.timer}} 秒
                </span>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
        <TabPanel header="流程控制" v-if="playerData.role === 1">
          <div class="row g-3" style="text-align: center">
            <div class="col-12">
              <Button :label="stepRunning ? '播放中' : '播放'" @click="startStep" :disabled="stepRunning" icon="pi pi-caret-right" class="p-button-rounded p-button-raised p-button-lg"/>
            </div>
            <div class="col-12">
              <Button label="重置" @click="resetStep" icon="pi pi-replay" class="p-button-rounded p-button-raised p-button-lg p-button-secondary"/>
            </div>
            <div class="col-12">
              <Button label="返回設定" @click="backToSetting" icon="pi pi-arrow-left" class="p-button-rounded p-button-raised p-button-lg p-button-secondary"/>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <VueModal v-model="stepShowModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center" style="text-align: center">
        <div class="col-3" v-for="player in shownPlayers" :key="player.socketId">
          <Avatar v-if="!player.avatar" icon="pi pi-user" class="mb-2" size="large" shape="circle"/>
          <Avatar v-else :image="player.avatar" class="mb-2" size="large" shape="circle"/>
          <div>{{ player.name }}</div>
        </div>
      </div>
    </VueModal>

    <VueModal v-model="stepMarkModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center" style="text-align: center">
        <div class="col-3" v-for="player in shownPlayers" :key="player.socketId" @click="mark(player.socketId)" style="position: relative;">
          <div v-if="markedPlayers.includes(player.socketId)" class="mark" :class="{self: player.socketId === myMarkedPlayer}">{{ markLabel }}</div>
          <Avatar v-if="!player.avatar" icon="pi pi-user" class="mb-2" size="large" shape="circle" style="cursor: pointer;"/>
          <Avatar v-else :image="player.avatar" class="mb-2" size="large" shape="circle" style="cursor: pointer;"/>
          <div>{{ player.name }}</div>
        </div>
      </div>
    </VueModal>

    <VueModal v-model="markedResultModal" :enableClose="true" :title="currentStepTitle">
      <div class="mb-5 mt-3"></div>
      <div class="row flex-wrap justify-content-center" style="text-align: center">
        <div class="col-3" v-for="(result,index) in markedResult" :key="index" style="position: relative;">
          <div class="mark self">{{ result.markLabel }}</div>
          <Avatar v-if="!result.player.avatar" icon="pi pi-user" class="mb-2" size="large" shape="circle"/>
          <Avatar v-else :image="result.player.avatar" class="mb-2" size="large" shape="circle"/>
          <div>{{ result.player.name }}</div>
        </div>
      </div>
    </VueModal>
  </div>
</template>

<script>
import Avatar from 'primevue/avatar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import VueModal from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Start',
  components: {
    Avatar,
    TabView,
    TabPanel,
    VueModal
  },
  data () {
    return {
      stepRunning: false,
      currentStepTitle: '',
      stepShowModal: false,
      stepMarkModal: false,
      markedResultModal: false,

      shownPlayers: [],
      myMarkedPlayer: null,
      markedPlayers: [],
      markLabel: null,
      markedResult: [],

      intervalTimer: null
    }
  },
  computed: {
    ...mapState('room', ['gameInfo', 'playerList', 'msg']),
    ...mapGetters('room', ['playerData'])
  },
  methods: {
    backToSetting () {
      this.$socket.emit('backToSetting')
    },
    leaveRoom () {
      this.$socket.disconnect()
      this.$store.commit('room/reset')
      this.$router.push('/play')
      this.$destroy()
    },
    startStep () {
      this.$socket.emit('startStep')
    },
    resetStep () {
      speechSynthesis.cancel()
      this.$socket.emit('resetStep')
    },
    mark (socketId) {
      this.markedPlayers.push(socketId)

      const index = this.markedPlayers.findIndex(id => id === this.myMarkedPlayer)
      if (index >= 0) {
        this.markedPlayers.splice(index, 1)
      }

      this.$socket.emit('updateMarkedPlayers', this.markedPlayers)
      this.myMarkedPlayer = socketId
    },
    stepVoice (msg, step) {
      return new Promise((resolve, reject) => {
        msg.onend = resolve
        msg.text = step.data
        speechSynthesis.speak(msg)
      })
    },
    stepShow (step, timer) {
      if (step.data.conductingRoleListType === 'all' ||
        (step.data.conductingRoleListType === this.playerData.camp && step.data.conductingRoleId === 'all') ||
        step.data.conductingRoleId === this.playerData.campRoleId ||
        step.data.conductingRoleId === this.playerData.funRoleId) {
        this.currentStepTitle = `${this.translateRoleType(step.data.conductingRoleListType)} ${this.translateRoleName(step.data.conductingRoleListType, step.data.conductingRoleId)} 執行顯示 ${this.translateRoleType(step.data.roleListType)} ${this.translateRoleName(step.data.roleListType, step.data.roleId)}，時間 ${step.data.timer} 秒`
        const totalTime = timer

        return new Promise((resolve, reject) => {
          this.stepShowModal = true

          this.intervalTimer = setInterval(() => {
            timer -= 10
            if (this.$refs.stepShowCountDown) {
              this.$refs.stepShowCountDown.style.width = parseInt((timer / totalTime) * 100) + '%'
            }

            if (timer < 0) {
              clearInterval(this.intervalTimer)
              this.stepShowModal = false
              resolve()
            }
          }, 10)
        })
      }
    },
    stepMark (step, timer) {
      if (step.data.conductingRoleListType === 'all' ||
        (step.data.conductingRoleListType === this.playerData.camp && step.data.conductingRoleId === 'all') ||
        step.data.conductingRoleId === this.playerData.campRoleId ||
        step.data.conductingRoleId === this.playerData.funRoleId) {
        this.currentStepTitle = `${this.translateRoleType(step.data.conductingRoleListType)} ${this.translateRoleName(step.data.conductingRoleListType, step.data.conductingRoleId)} 執行標記，時間 ${step.data.timer} 秒`
        this.markLabel = step.data.label
        const totalTime = timer

        return new Promise((resolve, reject) => {
          this.stepMarkModal = true

          this.intervalTimer = setInterval(() => {
            timer -= 10
            if (this.$refs.stepShowCountDown) {
              this.$refs.stepShowCountDown.style.width = parseInt((timer / totalTime) * 100) + '%'
            }

            if (timer < 0) {
              clearInterval(this.intervalTimer)
              this.stepMarkModal = false
              this.myMarkedPlayer = null
              resolve()
            }
          }, 10)
        })
      }
    },
    translateRoleType (roleType) {
      switch (roleType) {
        case 'goodCampRoleList':
          return '好人陣營'
        case 'badCampRoleList':
          return '壞人陣營'
        case 'funRoleList':
          return '功能角色'
        case 'all':
          return '所有人'
      }
    },
    translateRoleName (roleType, roleId) {
      if (this.gameInfo[roleType]) {
        for (const role of this.gameInfo[roleType]) {
          if (role.id === roleId) {
            return role.name
          }
        }
        return '所有人'
      }
      return ''
    }
  },
  sockets: {
    backToSetting () {
      this.$router.push('/room')
    },
    async runStep (gameStep) {
      this.markedResultModal = false
      if (!this.stepRunning) this.stepRunning = true
      const stepList = this.gameInfo.stepList
      const msg = this.msg
      const playerList = this.playerList

      if (stepList[gameStep]) {
        switch (stepList[gameStep].mode) {
          case '語音':
            await this.stepVoice(msg, stepList[gameStep])
            break
          case '顯示':
            if (stepList[gameStep].data.roleListType === 'all') {
              this.shownPlayers = playerList
            } else if (stepList[gameStep].data.roleListType === 'funRoleList') {
              this.shownPlayers = playerList.filter(player => player.funRoleId === stepList[gameStep].data.roleId)
            } else if (stepList[gameStep].data.roleListType === 'goodCampRoleList') {
              if (stepList[gameStep].data.roleId === 'all') {
                this.shownPlayers = playerList.filter(player => player.camp === 'goodCampRoleList')
              } else {
                this.shownPlayers = playerList.filter(player => player.campRoleId === stepList[gameStep].data.roleId)
              }
            } else if (stepList[gameStep].data.roleListType === 'badCampRoleList') {
              if (stepList[gameStep].data.roleId === 'all') {
                this.shownPlayers = playerList.filter(player => player.camp === 'badCampRoleList')
              } else {
                this.shownPlayers = playerList.filter(player => player.campRoleId === stepList[gameStep].data.roleId)
              }
            }
            await this.stepShow(stepList[gameStep], stepList[gameStep].data.timer * 1000)
            break
          case '標記':
            this.shownPlayers = playerList
            this.$socket.emit('updateShownPlayers', this.shownPlayers)
            await this.stepMark(stepList[gameStep], stepList[gameStep].data.timer * 1000)
            break
        }
      }

      this.$socket.emit('stepDone')
    },
    resetStep () {
      clearInterval(this.intervalTimer)
      this.stepShowModal = false
      this.stepMarkModal = false
      this.stepRunning = false
    },
    updateMarkedPlayers (markedPlayers) {
      this.markedPlayers = markedPlayers
    },
    showMarkedResult (markedResult) {
      if (markedResult.length) {
        this.currentStepTitle = '結果'
        this.markedResult = markedResult
        this.markedResultModal = true
      }
    }
  }
}
</script>

<style lang="scss">
#start {
  padding: 4rem 0rem;

  .p-tabview-nav {
    justify-content: center;
  }

  .p-tabview-panels {
    padding: 0;
    padding-top: 2rem;
  }
}

.vm {
  top: 50%;
  transform: translateY(-50%);
  .vm-titlebar {
    text-align: center;
  }
}

.mark {
    padding: 0.125rem 0.25rem;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -120%);
    color: #faa;
    border: 2px solid #faa;
    &.self {
      color: red;
      border: 2px solid red;
    }
}
</style>
