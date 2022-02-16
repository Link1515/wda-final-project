<template>
  <div id="start" class="viewBox routerviewHeight">
    <div class="subViewBox">
      <TabView>
        <TabPanel header="在線玩家">
          <DataTable stripedRows :value="playerList">
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
        </TabPanel>
        <TabPanel header="遊戲流程">
          <DataTable stripedRows :value="gameInfo.stepList">
            <Column :bodyStyle="{ textAlign: 'center', justifyContent: 'center' }">
              <template #body="slotProps">
                <span v-if="slotProps.data.mode === '語音'">
                  {{ slotProps.data.data }}
                </span>
                <span v-else-if="slotProps.data.mode === '顯示'">
                  顯示 {{ translateRoleType(slotProps.data.data.roleListType) }} {{translateRoleName(slotProps.data.data.roleListType, slotProps.data.data.roleId)}}，時間 {{slotProps.data.data.timer}} 秒
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
          </div>
        </TabPanel>
      </TabView>
    </div>

    <VueModal v-model="stepShowModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center" style="text-align: center">
        <div class="col-3" v-for="player in showedPlayers" :key="player.playerId">
          <Avatar icon="pi pi-user" class="mb-2" size="large" shape="circle"/>
          <div>{{ player.name }}</div>
        </div>
      </div>
    </VueModal>

    <VueModal v-model="stepMarkModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center" style="text-align: center">
        <div class="col-3" v-for="player in showedPlayers" :key="player.playerId" @click="markedPlayer = player.playerId" style="position: relative;">
          <div v-if="player.playerId === markedPlayer" class="mark">標記</div>
          <Avatar
            icon="pi pi-user"
            class="mb-2" size="large" shape="circle"
            style="cursor: pointer;"
          />
          <div>{{ player.name }}</div>
        </div>
      </div>
    </VueModal>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import VueModal from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Start',
  components: {
    DataTable,
    Column,
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
      showedPlayers: [],
      markedPlayer: null
    }
  },
  computed: {
    ...mapState('room', ['gameInfo', 'playerList', 'msg']),
    ...mapGetters('room', ['playerData'])
  },
  methods: {
    startStep () {
      this.$socket.emit('startStep')
    },
    resetStep () {
      speechSynthesis.cancel()
      this.$socket.emit('resetStep')
    },
    stepVoice (msg, step) {
      return new Promise((resolve, reject) => {
        msg.onend = resolve
        msg.text = step.data
        speechSynthesis.speak(msg)
      })
    },
    stepShow (step, timer) {
      this.currentStepTitle = `顯示 ${this.translateRoleType(step.data.roleListType)} ${this.translateRoleName(step.data.roleListType, step.data.roleId)}，時間 ${step.data.timer} 秒`
      const totalTime = timer

      return new Promise((resolve, reject) => {
        this.stepShowModal = true

        const intervalTimer = setInterval(() => {
          timer -= 10
          if (this.$refs.stepShowCountDown) {
            this.$refs.stepShowCountDown.style.width = parseInt((timer / totalTime) * 100) + '%'
          }

          if (timer < 0) {
            clearInterval(intervalTimer)
            this.stepShowModal = false
            resolve()
          }
        }, 10)
      })
    },
    stepMark (step, timer) {
      if (step.data.conductingRoleListType === 'all' ||
        step.data.conductingRoleId === this.playerData.campRoleId ||
        step.data.conductingRoleId === this.playerData.funRoleId) {
        this.currentStepTitle = `${this.translateRoleType(step.data.conductingRoleListType)} ${this.translateRoleName(step.data.conductingRoleListType, step.data.conductingRoleId)} 執行標記，時間 ${step.data.timer} 秒`
        const totalTime = timer

        return new Promise((resolve, reject) => {
          this.stepMarkModal = true

          const intervalTimer = setInterval(() => {
            timer -= 10
            if (this.$refs.stepShowCountDown) {
              this.$refs.stepShowCountDown.style.width = parseInt((timer / totalTime) * 100) + '%'
            }

            if (timer < 0) {
              clearInterval(intervalTimer)
              this.stepMarkModal = false
              this.markedPlayer = null
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
    async runStep (gameStep) {
      if (!this.stepRunning) this.stepRunning = true
      const stepList = this.gameInfo.stepList
      const msg = this.msg
      const playerList = this.playerList

      switch (stepList[gameStep].mode) {
        case '語音':
          await this.stepVoice(msg, stepList[gameStep])
          break
        case '顯示':
          if (stepList[gameStep].data.roleListType === 'all') {
            this.showedPlayers = playerList
          } else if (stepList[gameStep].data.roleListType === 'funRoleList') {
            this.showedPlayers = playerList.filter(player => player.funRoleId === stepList[gameStep].data.roleId)
          } else if (stepList[gameStep].data.roleListType === 'goodCampRoleList') {
            if (stepList[gameStep].data.roleId === 'all') {
              this.showedPlayers = playerList.filter(player => player.camp === true)
            } else {
              this.showedPlayers = playerList.filter(player => player.campRoleId === stepList[gameStep].data.roleId)
            }
          } else if (stepList[gameStep].data.roleListType === 'badCampRoleList') {
            if (stepList[gameStep].data.roleId === 'all') {
              this.showedPlayers = playerList.filter(player => player.camp === false)
            } else {
              this.showedPlayers = playerList.filter(player => player.campRoleId === stepList[gameStep].data.roleId)
            }
          }
          await this.stepShow(stepList[gameStep], stepList[gameStep].data.timer * 1000)
          break
        case '標記':
          this.showedPlayers = playerList
          await this.stepMark(stepList[gameStep], stepList[gameStep].data.timer * 1000)
          break
      }

      this.$socket.emit('stepDone')
    },
    resetStep () {
      this.stepShowModal = false
      this.stepMarkModal = false
      this.stepRunning = false
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
    position: absolute;
    color: red;
    border: 2px solid red;
}
</style>
