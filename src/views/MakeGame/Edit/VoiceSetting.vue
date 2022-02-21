<template>
  <div id="voicesetting">
    <div class="row" style="padding-bottom: 8rem">
      <div class="col-12 col-lg-6">
        <ul id="steplist" v-for="step in $store.getters['game/stepListDisplayHelper']" :key="step.id">
          <li><h2>{{step.name}}</h2></li>
          <li v-for="rule in step.rules" :key="rule.id">
            <template v-if="rule.mode === '語音'">
              {{ rule.data }}
            </template>
            <template v-if="rule.mode === '顯示'">
              顯示角色: {{ rule.roleListName }} {{ rule.roleName }}
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
        <div class="mt-4 d-flex flex-column align-items-center">
          <Button
            @click="playStep(index)"
            v-for="(step, index) in $store.state.game.stepList"
            :key="step.id" icon="pi pi-play"
            :label="'播放' + step.name"
            class="p-button-rounded p-button-raised p-button-lg mb-2"
          />
          <Button label="停止" class="p-button-rounded p-button-raised p-button-secondary p-button-lg mt-4"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'VoiceSetting',
  data () {
    return {
      voiceOptions: [
        { label: 'Google 小姐', value: 'Google 國語' },
        { label: 'Microsoft 小姐1', value: 'Microsoft Yating' },
        { label: 'Microsoft 小姐2', value: 'Microsoft Hanhan' },
        { label: 'Microsoft 先生', value: 'Microsoft Zhiwei' }
      ]
    }
  },
  methods: {
    playStep (index) {
      start(this.$store.state.game.stepList[index].rules, this.voiceType)
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
  return new Promise((resolve, reject) => {
    msg.onend = resolve
    msg.text = time
    speechSynthesis.speak(msg)
  })
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
</style>
