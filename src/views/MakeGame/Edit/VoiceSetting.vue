<template>
  <div id="voicesetting">
    <div class="row" style="padding-bottom: 8rem">
      <div class="col-12 col-lg-6">
        <StepList :list="$store.getters['game/stepListDisplayHelper']"/>
      </div>
      <div class="col-12 col-lg-6 controlPanel">
        <VSelect v-model="voiceType" :options="voiceOptions" value="value"/>
        <div class="mt-4" style="text-align:center">
          <Button @click="playStep" icon="pi pi-play" class="p-button-rounded p-button-raised p-button-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import StepList from '@/components/StepList'

export default {
  components: {
    StepList,
    VSelect
  },
  data () {
    return {
      voiceOptions: ['Google 國語', 'Microsoft Hanhan', 'Microsoft Yating', 'Microsoft Zhiwei']
    }
  },
  methods: {
    playStep () {
      start(this.$store.state.game.stepList, this.voiceType)
    }
  },
  computed: {
    voiceType: {
      get () {
        return this.$store.state.game.voiceType
      },
      set (vt) {
        this.$store.commit('game/updateVoiceType', vt)
      }
    }
  }
}

async function start (stepList, vt) {
  const voices = await getVoices()
  const voiceType = voices.filter(v => v.name.includes(vt))[0]
  const msg = new SpeechSynthesisUtterance()
  msg.voice = voiceType

  for (let i = 0; i < stepList.length; i++) {
    if (stepList[i].mode === '語音') {
      await stepVoice(msg, stepList[i])
    } else {
      await stepOthers(msg, stepList[i])
      for (let j = 0; j < stepList[i].data.timer + 1; j++) {
        await timer(msg, (stepList[i].data.timer - j))
      }
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

function stepOthers (msg, step) {
  return new Promise((resolve, reject) => {
    if (step.mode === '顯示') {
      msg.text = '顯示玩家中'
    } else if (step.mode === '標記') {
      msg.text = '標記玩家中'
    }
    msg.onend = resolve
    speechSynthesis.speak(msg)
  })
}

function timer (msg, time) {
  console.log(time)
  return new Promise((resolve, reject) => {
    msg.onend = resolve
    msg.text = time
    speechSynthesis.speak(msg)
  })
}
</script>

<style lang="scss">
#finalcheck {
  .controlPanel {
    text-align: center;
    padding-top: 1rem;
  }
}
</style>
