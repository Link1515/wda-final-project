<template>
  <div id="voicesetting">
    <div class="row" style="padding-bottom: 8rem">
      <div class="col-12 col-lg-6">
        <ul id="steplist" v-for="step in stepListDisplayHelper" :key="step.id">
          <li><h2>{{step.name}}</h2></li>
          <li v-for="rule in step.rules" :key="rule.id">
            <template v-if="rule.mode === '語音'">
              {{ rule.data }}
            </template>
            <template v-if="rule.mode === '顯示'">
              執行角色: {{ rule.conductingRoleListName }} {{ rule.conductingRoleName }}
              <br>
              顯示角色: {{ rule.roleListName }} {{ rule.roleName }}
              <br>
              時間: {{ rule.data.timer }} 秒
            </template>
            <template v-if="rule.mode === '查驗'">
              執行角色: {{ rule.conductingRoleListName }} {{ rule.conductingRoleName }}
              <br>
              時間: {{ rule.data.timer }} 秒
            </template>
            <template v-if="rule.mode === '標記'">
              執行角色: {{ rule.conductingRoleListName }} {{ rule.conductingRoleName }}
              <br>
              標記: {{ rule.data.label }}
              <br>
              時間: {{ rule.data.timer }} 秒
            </template>
          </li>
        </ul>
      </div>
      <div class="col-12 col-lg-6 controlPanel">
        <VueSelect v-model="voiceType" :options="voiceOptions" :reduce="v => v.value"/>
        <!-- <VueSelect> -->
        <div class="mt-4 d-flex flex-column align-items-center">
          <Button
            @click="playStep(index)"
            v-for="(step, index) in $store.state.game.stepList"
            :key="step.id" icon="pi pi-play"
            :label="'播放' + step.name"
            class="p-button-rounded p-button-raised p-button-lg mb-2"
          />
          <Button label="停止" @click="stopStep" class="p-button-rounded p-button-raised p-button-secondary p-button-lg mt-4"/>
        </div>
      </div>
    </div>

    <!-- ****** 顯示 modal ****** -->
    <VueModal v-model="stepShowModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center g-5" style="text-align: center">
        <div class="col-3" v-for="n in 4" :key="n">
          <Avatar icon="pi pi-user" class="mb-2" size="large" shape="circle"/>
          <div>範例玩家 {{ n }}</div>
        </div>
      </div>
    </VueModal>

    <!-- ****** 查驗 modal ****** -->
    <VueModal v-model="stepCheckModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center g-5" style="text-align: center">
        <div class="col-3" v-for="n in 4" :key="n" @click="checkedPlayer = n" style="position: relative;">
          <div v-if="n === checkedPlayer" class="mark self">查驗</div>
          <Avatar icon="pi pi-user" class="mb-2" size="large" shape="circle" style="cursor: pointer;"/>
          <div>範例玩家 {{ n }}</div>
        </div>
      </div>
    </VueModal>

    <!-- ****** 標記 modal ****** -->
    <VueModal v-model="stepMarkModal" :enableClose="false" :title="currentStepTitle">
      <div ref="stepShowCountDown" class="mb-5 mt-3" style="background: red; height: 5px"></div>
      <div class="row flex-wrap justify-content-center g-5" style="text-align: center">
        <div class="col-3" v-for="n in 4" :key="n" @click="checkedPlayer = n" style="position: relative;">
          <div v-if="n === checkedPlayer" class="mark self">{{ markLabel }}</div>
          <Avatar icon="pi pi-user" class="mb-2" size="large" shape="circle" style="cursor: pointer;"/>
          <div>範例玩家 {{ n }}</div>
        </div>
      </div>
    </VueModal>
  </div>
</template>

<script>
import VueModal from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'VoiceSetting',
  components: {
    VueModal
  },
  data () {
    return {
      voiceOptions: [
        { label: 'Google 小姐', value: 'Google 國語' },
        { label: 'Microsoft 小姐1', value: 'Microsoft Yating' },
        { label: 'Microsoft 小姐2', value: 'Microsoft Hanhan' },
        { label: 'Microsoft 先生', value: 'Microsoft Zhiwei' }
      ],
      msg: null,
      currentStepTitle: '',
      currentStep: 0,

      stepShowModal: false,
      stepCheckModal: false,
      checkedPlayer: null,
      stepMarkModal: false,
      markLabel: ''
    }
  },
  methods: {
    async playStep (index) {
      if (this.currentStep < 0) {
        this.currentStep = 0
      }

      while (this.currentStep < this.stepList[index].rules.length) {
        const rule = this.stepList[index].rules[this.currentStep]

        switch (rule.mode) {
          case '語音':
            await this.stepVoice(rule.data)
            break
          case '顯示':
            await this.stepShow(rule.data.timer * 1000)
            break
          case '查驗':
            await this.stepCheck(rule.data.timer * 1000)
            break
          case '標記':
            this.markLabel = rule.data.label
            await this.stepMark(rule.data.timer * 1000)
            this.markLabel = ''
            break
        }

        this.checkedPlayer = null
        this.currentStep++
      }

      this.currentStep = 0
    },
    stopStep () {
      this.currentStep = -99
    },

    stepVoice (text) {
      return new Promise((resolve, reject) => {
        this.msg.onend = resolve
        this.msg.text = text
        speechSynthesis.speak(this.msg)
      })
    },
    stepShow (timer) {
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
    },
    stepCheck (timer) {
      const totalTime = timer

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
            resolve()
          }
        }, 10)
      })
    },
    stepMark (timer) {
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
  computed: {
    ...mapState('game', ['stepList']),
    ...mapGetters('game', ['stepListDisplayHelper']),
    voiceType: {
      get () {
        return this.$store.state.game.voiceType
      },
      async set (vt) {
        this.$store.commit('game/updateVoiceType', vt)
        const voices = await getVoices()
        const VT = voices.filter(v => v.name.includes(vt))[0]
        this.msg = new SpeechSynthesisUtterance()
        this.msg.voice = VT
      }
    }
  },
  async created () {
    const voices = await getVoices()
    const VT = voices.filter(v => v.name.includes(this.voiceType))[0]
    this.msg = new SpeechSynthesisUtterance()
    this.msg.voice = VT
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
</script>

<style lang="scss">
#voicesetting {
  .controlPanel {
    text-align: center;
    padding-top: 1rem;
  }

  #steplist {
    text-align: center;
    border-radius: 10px;
    padding: 1rem 5rem;
    background-color: #fff;

    li + li {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 3px dotted #666;
    }
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
