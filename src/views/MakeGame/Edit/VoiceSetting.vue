<template>
  <div id="voicesetting">
    <div class="row" style="padding-bottom: 8rem">
      <div class="col-12 col-lg-6">
        <h2 v-if="stepListDisplayHelper[stepIndex]" class="stepHeader">{{ stepListDisplayHelper[stepIndex].name }}</h2>
        <StepList v-if="stepListDisplayHelper[stepIndex]" :data="stepListDisplayHelper[stepIndex].rules"/>
      </div>
      <div class="col-12 col-lg-6 controlPanel">
        <VueSelect v-model="voiceType" :options="voiceOptions" :reduce="v => v.value" class="mb-5"/>
        <div class="mb-3">播放流程</div>
        <VueSelect
          v-model="stepIndex"
          :options="$store.state.game.stepList"
          label="name" placeholder="請選擇流程"
          :reduce="v => $store.state.game.stepList.indexOf(v)"
        />
        <div class="mt-4 d-flex flex-column align-items-center">
          <Button
            @click="playStep"
            :disabled="stepRunning"
            :label="stepRunning ? '播放中' : '播放'" icon="pi pi-caret-right"
            class="p-button-rounded p-button-raised p-button-lg mb-2"
          />
          <Button label="停止" @click="stopStep" icon="pi pi-stop" class="p-button-rounded p-button-raised p-button-secondary p-button-lg mt-4"/>
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

    <Toast position="top-center"/>
  </div>
</template>

<script>
import VueModal from '@kouts/vue-modal'
import StepList from '@/components/StepList.vue'
import '@kouts/vue-modal/dist/vue-modal.css'
import { mapGetters, mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'VoiceSetting',
  components: {
    VueModal,
    StepList
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
      stepIndex: '',
      currentStepTitle: '',
      currentStep: -99,

      stepShowModal: false,
      stepCheckModal: false,
      checkedPlayer: null,
      stepMarkModal: false,
      markLabel: ''
    }
  },
  validations: {
    stepIndex: {
      required
    }
  },
  methods: {
    async playStep () {
      this.$v.$touch()
      if (!this.$v.stepIndex.required) {
        this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇流程', life: 3000 })
        return
      }

      if (this.currentStep < 0) {
        this.currentStep = 0
      }

      while (this.currentStep < this.stepList[this.stepIndex].rules.length) {
        const rule = this.stepList[this.stepIndex].rules[this.currentStep]

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

      this.currentStep = -99
    },
    stopStep () {
      speechSynthesis.cancel()
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
    },
    stepRunning () {
      return this.currentStep >= 0
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

  .stepHeader {
    width: max-content;
    margin: 1rem auto;
    padding: 5px 10px;
    border-radius: 9999px;
    background-color: #ffc107;
  }
}

.v-select {
  background-color: #fff;
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
