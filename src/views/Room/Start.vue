<template>
  <div id="start" class="viewBox routerviewHeight">
    <div class="subViewBox">
      <TabView>
        <TabPanel header="流程控制" v-if="playerData && playerData.role === 1">
          <div class="row g-3" style="text-align: center">
            <div class="col-12">
              <VueSelect
                v-model="stepIndex"
                :options="gameInfo.stepList"
                :reduce="s => gameInfo.stepList.findIndex(step => step.id === s.id)"
                label="name" placeholder="選擇流程" class="VueSelectWidth mx-auto mb-4"
              />
            </div>
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
        <TabPanel header="在線玩家">
          <DataTable stripedRows :value="playerList" class="mb-3">
            <Column :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <FontAwesomeIcon v-if="slotProps.data.role === 1" :icon="['fas','crown']" style="color: #fa0"></FontAwesomeIcon>
              </template>
            </Column>
            <Column header="玩家頭像" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <Avatar v-if="slotProps.data.avatar" :image="slotProps.data.avatar" size="large" shape="circle"/>
                <Avatar v-else icon="pi pi-user" size="large" shape="circle"/>
              </template>
            </Column>
            <Column header="玩家暱稱" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <span :class="{ self: $socket.id === slotProps.data.socketId }">{{ slotProps.data.name }}</span>
              </template>
            </Column>
            <Column header="淘汰設定" v-if="playerData && playerData.role === 1" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <ToggleButton
                  v-model="slotProps.data.alive"
                  @change="eliminatePlayer"
                  onLabel="存活" offLabel="淘汰"
                  class="p-button-rounded p-button-raised"
                />
              </template>
            </Column>
            <Column header="淘汰狀況" v-else :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <span v-if="slotProps.data.alive" class="aliveLabel">存活</span>
                <span v-else class="aliveLabel eliminate">淘汰</span>
              </template>
            </Column>
          </DataTable>
          <div style="text-align: center">
            <Button label="離開房間" @click="leaveRoom" class="p-button-rounded p-button-raised p-button-danger"/>
          </div>
        </TabPanel>
        <TabPanel header="遊戲流程" v-if="stepIndex !== '' && stepListDisplayHelper[stepIndex]">
          <h2 style="text-align: center" class="stepHeader">{{ stepListDisplayHelper[stepIndex].name }}</h2>
          <StepList :data="stepListDisplayHelper[stepIndex].rules"/>
        </TabPanel>
      </TabView>
    </div>

    <!-- ****** 計時 modal ****** -->
    <VueModal v-model="stepCountDownModal" :enableClose="false" :title="currentStepTitle" outClass="cancelTransistion">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
    </VueModal>

    <!-- ****** 顯示 modal ****** -->
    <VueModal v-model="stepShowModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center g-5" style="text-align: center">
        <div class="col-3" v-for="(player, index) in shownPlayers" :key="index" style="position: relative;">
          <div v-if="player.markLabel" class="mark self">{{ player.markLabel }}</div>
          <Avatar v-if="!player.avatar" icon="pi pi-user" class="mb-2" size="large" shape="circle"/>
          <Avatar v-else :image="player.avatar" class="mb-2" size="large" shape="circle"/>
          <div>{{ player.name }}</div>
        </div>
      </div>
    </VueModal>

    <!-- ****** 查驗 modal ****** -->
    <VueModal v-model="stepCheckModal" :enableClose="false" :title="currentStepTitle" outClass="cancelTransistion">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center g-5" style="text-align: center">
        <div class="col-3" v-for="player in shownPlayers" :key="player.socketId" @click="checkedPlayer = player" style="position: relative;">
          <div v-if="checkedPlayer && checkedPlayer.socketId === player.socketId" class="mark self">查驗</div>
          <Avatar v-if="!player.avatar" icon="pi pi-user" class="mb-2" size="large" shape="circle" style="cursor: pointer;"/>
          <Avatar v-else :image="player.avatar" class="mb-2" size="large" shape="circle" style="cursor: pointer;"/>
          <div>{{ player.name }}</div>
        </div>
      </div>
    </VueModal>

    <VueModal v-model="playerInfoModal" :enableClose="false" :title="currentStepTitle" outClass="cancelTransistion">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center g-5" style="text-align: center">
        <div class="col-3" v-if="checkedPlayer">
          <Avatar v-if="!checkedPlayer.avatar" icon="pi pi-user" class="mb-2" size="large" shape="circle"/>
          <Avatar v-else :image="checkedPlayer.avatar" class="mb-2" size="large" shape="circle"/>
          <div class="mb-3">{{ checkedPlayer.name }}</div>
          <div>{{ translateRoleType(checkedPlayer.camp) }}</div>
        </div>
      </div>
    </VueModal>

    <!-- ****** 標記 modal ****** -->
    <VueModal v-model="stepMarkModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center g-5" style="text-align: center">
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
      <div class="row flex-wrap justify-content-center g-5" style="text-align: center">
        <div class="col-3" v-for="(result,index) in markedResult" :key="index" style="position: relative;">
          <div class="mark self">{{ result.markLabel }}</div>
          <Avatar v-if="!result.avatar" icon="pi pi-user" class="mb-2" size="large" shape="circle"/>
          <Avatar v-else :image="result.avatar" class="mb-2" size="large" shape="circle"/>
          <div>{{ result.name }}</div>
        </div>
      </div>
    </VueModal>

    <!-- ****** 多選一 modal ****** -->
    <VueModal v-model="stepPickOneModal" :enableClose="false" :title="currentStepTitle" outClass="cancelTransistion">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="d-flex flex-column g-3">
        <div v-for="opt in stepPickOneOptData" :key="opt.inc" style="text-align: center; margin-bottom: 0.5rem">
          <RadioButton @change="pick(opt.inc, stepPickOneOptData.length)" :id="opt.name" v-model="pickOneInc" :value="opt.inc" class="me-3"/><label :for="opt.name" style="cursor: pointer">{{ opt.name }}</label>
        </div>
      </div>
    </VueModal>

    <Toast position="top-center"/>
  </div>
</template>

<script>
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ToggleButton from 'primevue/togglebutton'
import RadioButton from 'primevue/radiobutton'
import VueModal from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'
import { mapState, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import StepList from '@/components/StepList.vue'

export default {
  name: 'Start',
  components: {
    TabView,
    TabPanel,
    ToggleButton,
    RadioButton,
    VueModal,
    StepList
  },
  data () {
    return {
      stepRunning: false,
      currentStepTitle: '',
      stepIndex: '',
      stepCountDownModal: false,
      stepShowModal: false,
      stepCheckModal: false,
      playerInfoModal: false,
      stepMarkModal: false,
      markedResultModal: false,
      stepPickOneModal: false,

      shownPlayers: [],
      checkedPlayer: null,
      myMarkedPlayer: null,
      markedPlayers: [],
      markLabel: null,
      markedResult: [],
      pickOneInc: -1,
      stepPickOneOptData: [],

      intervalTimer: null
    }
  },
  validations: {
    stepIndex: {
      required
    }
  },
  computed: {
    ...mapState('room', ['gameInfo', 'playerList', 'msg', 'startState']),
    ...mapGetters('room', ['playerData', 'stepListDisplayHelper'])
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
      this.$v.$touch()
      if (!this.$v.stepIndex.required) {
        this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇流程', life: 3000 })
        return
      }
      this.$socket.emit('startStep', this.stepIndex)
    },
    resetStep () {
      speechSynthesis.cancel()
      this.$socket.emit('resetStep')
    },
    eliminatePlayer () {
      this.$socket.emit('eliminatePlayer', this.playerList)
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
    pick (skipInc, skipLength) {
      this.$socket.emit('updateSkipInc', { skipInc, skipLength })
    },
    stepVoice (msg, step) {
      return new Promise((resolve, reject) => {
        msg.onend = resolve
        msg.text = step.data
        speechSynthesis.speak(msg)
      })
    },
    stepCountDown (timer) {
      const totalTime = timer
      this.currentStepTitle = `倒數 ${totalTime / 1000} 秒`

      return new Promise((resolve, reject) => {
        this.stepCountDownModal = true

        this.intervalTimer = setInterval(() => {
          timer -= 10
          if (this.$refs.stepShowCountDown) {
            this.$refs.stepShowCountDown.style.width = parseInt((timer / totalTime) * 100) + '%'
          }

          if (timer < 0) {
            clearInterval(this.intervalTimer)
            this.stepCountDownModal = false
            resolve()
          }
        }, 10)
      })
    },
    stepShow (step, timer) {
      if (step.data.conductingRoleListType === 'all' ||
        (step.data.conductingRoleListType === this.playerData.camp && step.data.conductingRoleId === 'all') ||
        step.data.conductingRoleId === this.playerData.campRoleId ||
        step.data.conductingRoleId === this.playerData.funRoleId) {
        if (this.playerData.alive) {
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
      }
    },
    stepCheck (step, timer) {
      if (step.data.conductingRoleListType === 'all' ||
        (step.data.conductingRoleListType === this.playerData.camp && step.data.conductingRoleId === 'all') ||
        step.data.conductingRoleId === this.playerData.campRoleId ||
        step.data.conductingRoleId === this.playerData.funRoleId) {
        if (this.playerData.alive) {
          this.currentStepTitle = `${this.translateRoleType(step.data.conductingRoleListType)} ${this.translateRoleName(step.data.conductingRoleListType, step.data.conductingRoleId)} 執行查驗，時間 ${step.data.timer} 秒`
          const totalTime = timer
          let showInfoTimer = 5000
          const showInfoTotalTime = showInfoTimer

          return new Promise((resolve, reject) => {
            this.stepCheckModal = true

            this.intervalTimer = setInterval(() => {
              timer -= 10
              if (this.$refs.stepShowCountDown) {
                this.$refs.stepShowCountDown.style.width = parseInt((timer / totalTime) * 100) + '%'
              }

              if (timer < 0) {
                clearInterval(this.intervalTimer)
                this.stepCheckModal = false

                if (!this.checkedPlayer) {
                  const randomNum = Math.round(Math.random() * (this.shownPlayers.length - 1))
                  this.checkedPlayer = this.shownPlayers[randomNum]
                }

                this.currentStepTitle = '查驗結果'
                this.playerInfoModal = true

                this.intervalTimer = setInterval(() => {
                  showInfoTimer -= 10
                  if (this.$refs.stepShowCountDown) {
                    this.$refs.stepShowCountDown.style.width = parseInt((showInfoTimer / showInfoTotalTime) * 100) + '%'
                  }

                  if (showInfoTimer < 0) {
                    clearInterval(this.intervalTimer)
                    this.playerInfoModal = false
                    this.checkedPlayer = null

                    resolve()
                  }
                }, 10)
              }
            }, 10)
          })
        }
      }
    },
    stepMark (step, timer) {
      if (step.data.conductingRoleListType === 'all' ||
        (step.data.conductingRoleListType === this.playerData.camp && step.data.conductingRoleId === 'all') ||
        step.data.conductingRoleId === this.playerData.campRoleId ||
        step.data.conductingRoleId === this.playerData.funRoleId) {
        if (this.playerData.alive) {
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
                resolve(true)
              }
            }, 10)
          })
        }
      }
    },
    stepPickOne (step, timer) {
      if (step.data.conductingRoleListType === 'all' ||
        (step.data.conductingRoleListType === this.playerData.camp && step.data.conductingRoleId === 'all') ||
        step.data.conductingRoleId === this.playerData.campRoleId ||
        step.data.conductingRoleId === this.playerData.funRoleId) {
        this.currentStepTitle = '選擇要執行的項目'
        this.stepPickOneOptData = step.data.optionsData
        const totalTime = timer

        return new Promise((resolve, reject) => {
          this.stepPickOneModal = true

          this.intervalTimer = setInterval(() => {
            timer -= 10
            if (this.$refs.stepShowCountDown) {
              this.$refs.stepShowCountDown.style.width = parseInt((timer / totalTime) * 100) + '%'
            }

            if (timer < 0) {
              clearInterval(this.intervalTimer)
              this.stepPickOneModal = false
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
        case 'labelResult':
          return '標記結果'
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
      this.$router.push('/room').catch(() => {})
    },
    async runStep ({ stepIndex, gameStep }) {
      this.markedResultModal = false
      if (!this.stepRunning) this.stepRunning = true
      if (!isNaN(stepIndex) && stepIndex >= 0) this.stepIndex = stepIndex
      const stepList = this.gameInfo.stepList[this.stepIndex].rules
      const msg = this.msg
      const playerList = this.playerList.filter(player => player.alive)

      let markState = false
      if (stepList[gameStep]) {
        switch (stepList[gameStep].mode) {
          case '語音':
            await this.stepVoice(msg, stepList[gameStep])
            break
          case '計時':
            await this.stepCountDown(stepList[gameStep].data * 1000)
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
            } else if (stepList[gameStep].data.roleListType === 'labelResult') {
              this.shownPlayers = this.markedResult
            }
            await this.stepShow(stepList[gameStep], stepList[gameStep].data.timer * 1000)
            break
          case '查驗':
            this.shownPlayers = playerList
            await this.stepCheck(stepList[gameStep], stepList[gameStep].data.timer * 1000)
            break
          case '標記':
            this.shownPlayers = playerList
            this.$socket.emit('updateShownPlayers', this.shownPlayers)
            markState = await this.stepMark(stepList[gameStep], stepList[gameStep].data.timer * 1000)
            break
          case '多選一':
            await this.stepPickOne(stepList[gameStep], stepList[gameStep].data.timer * 1000)
            break
        }
      }

      this.$socket.emit('stepDone', markState)
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
    updateMarkedResult (markedResult) {
      this.markedResult = markedResult
    },
    showMarkedResult (markedResult) {
      if (markedResult.length) {
        this.currentStepTitle = '結果'
        this.markedResult = markedResult
        this.markedResultModal = true
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$socket.connected) {
        next('/play')
        return
      }
      if (!vm.startState) {
        next('/room')
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.startState) return false
    next()
  }
}
</script>

<style lang="scss">
#start {
  padding: 4rem 0rem;

  .aliveLabel {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid transparent;
    background-color: #ffc107;

    &.eliminate {
      background-color: #fff;
      box-shadow: none;
      border: 1px solid #ccc;
    }
  }

  .stepHeader {
    width: max-content;
    margin: 1rem auto;
    padding: 5px 10px;
    border-radius: 9999px;
    background-color: #ffc107;
  }

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
  padding-bottom: 2rem;
  .vm-titlebar {
    text-align: center;
  }
  .cancelTransistion {
    transition: 0;
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
