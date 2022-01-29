<template>
  <div id="stepSetting">
    <div class="stepSetting_header">
      <Button @click="showConfigPanel" label="新增流程" icon="pi pi-plus-circle" class="p-button-lg p-button-rounded p-button-raised"/>
    </div>
    <Draggable
      tag="ul"
      v-model="stepList"
      handle=".handle"
      :animation="300"
    >
      <transition-group>
        <li
          class="list-group-item"
          v-for="step in stepList"
          :key="step.id"
        >
          <Avatar :icon="iconType(step.mode)" shape="circle" class="me-2" :style="{background: iconColor (step.mode)}"/>
          <span class="me-auto">{{ step.mode }}</span>
          <p>
            <span>{{ step.data }}</span>
            <i class="pi pi-bars handle"></i>
          </p>
        </li>
      </transition-group>
    </Draggable>

    <Dialog :visible.sync="displayConfig" :showHeader="false" modal dismissableMask>
      <form class="configForm d-flex flex-column align-items-center">
        <Dropdown
          v-model="configModel.mode"
          :options="configs"
          optionLabel="mode"
          optionValue="mode"
          placeholder="選擇模式"
        />
        <p v-show="configModel.mode">{{ configIntro }}</p>
        <Textarea
          v-model.trim="configModel.audioText"
          v-show="configModel.mode === '語音'"
          :autoResize="true"
          rows="5" cols="30"
        />
        <InputNumber
          v-model="configModel.timer"
          v-show="configModel.mode === '計時器'"
          showButtons buttonLayout="horizontal"
          :step="1"
          :min="1"
          :max="999"
          suffix=" 秒"
        />
        <InputText
          v-model.trim="configModel.playerLabel"
          v-show="configModel.mode === '標記玩家'"
          placeholder="自訂標籤"
        />
      </form>
      <template #footer>
        <Button @click="addStepList" :disabled="!canAdd" v-show="configModel.mode" label="添加" class="p-button-rounded p-button-raised"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Avatar from 'primevue/avatar'

export default {
  components: {
    Draggable,
    Dropdown,
    InputNumber,
    Avatar
  },
  data () {
    return {
      displayConfig: false,
      configs: [
        { mode: '語音', intro: '透過語音撥放以下輸入的文字' },
        { mode: '計時器', intro: '間隔設定時間後，執行下一個步驟' },
        { mode: '標記玩家', intro: '執行時可以標記指定的玩家，需要自訂標籤，如: 死亡、警長保護...等' }
      ],
      configModel: {
        mode: '',
        audioText: '',
        timer: 1,
        playerLabel: ''
      },
      canAdd: false
    }
  },
  methods: {
    showConfigPanel () {
      this.displayConfig = true
    },
    addStepList () {
      let data = ''
      switch (this.configModel.mode) {
        case '語音':
          data = this.configModel.audioText
          break
        case '計時器':
          data = this.configModel.timer + ' 秒'
          break
        case '標記玩家':
          data = this.configModel.playerLabel
          break
      }
      this.displayConfig = false

      this.$store.commit('game/addStepList', { mode: this.configModel.mode, data })

      this.configModel.audioText = ''
      this.configModel.timer = 1
      this.configModel.playerLabel = ''
    },
    iconType (mode) {
      switch (mode) {
        case '語音':
          return 'pi pi-volume-up'
        case '計時器':
          return 'pi pi-clock'
        case '標記玩家':
          return 'pi pi-user-edit'
      }
    },
    iconColor (mode) {
      switch (mode) {
        case '語音':
          return '#EED19C'
        case '計時器':
          return '#ACBA9D'
        case '標記玩家':
          return '#E8837E'
      }
    }
  },
  computed: {
    configIntro () {
      const matchConfig = this.configs.filter(config => config.mode === this.configModel.mode)
      return matchConfig[0]?.intro
    },
    stepList: {
      get () {
        return this.$store.state.game.stepList
      },
      set (newOrderSetp) {
        this.$store.commit('game/updateStepList', newOrderSetp)
      }
    }
  },
  watch: {
    configModel: {
      deep: true,
      handler (config) {
        switch (config.mode) {
          case '語音':
            config.audioText.length > 0 ? this.canAdd = true : this.canAdd = false
            break
          case '計時器':
            this.canAdd = true
            break
          case '標記玩家':
            config.playerLabel.length > 0 ? this.canAdd = true : this.canAdd = false
            break
          default:
            this.canAdd = false
            break
        }
      }
    }
  }
}
</script>

<style lang="scss">
#stepSetting {
  textarea {
    border-radius: 0 !important;
  }

  .list-group-item {
    background-color: #eee;
    padding: 1rem 2rem;
    border-radius: 10px;
    margin-bottom: 3px;

    &.sortable-chosen {
      transition: background-color 0.3s;
      background-color: #bbb;
    }

    p {
      margin: 0 auto 1rem;
      font-size: 1.2rem;
      text-align: center;
      position: relative;

      span {
        display: inline-block;
        width: 50%;
      }
    }

    .handle {
      font-size: 1.5rem;
      cursor: move;
      position: absolute;
      right: 0;
      top: 0;
    }

    .p-tag {
      margin-right: 1rem;
    }
  }

  .configForm {
    width: 350px;
    min-height: 200px;
  }

  .p-dropdown,
  .p-inputtextarea {
    width: 100%;
  }

  .p-dialog-content {
    padding: 1.5rem;
  }

  .p-dialog-footer {
    text-align: center;
  }

  .p-inputnumber-input {
    border-radius: 0;
  }
}

.stepSetting_header {
  text-align: center;
  margin-bottom: 2rem;

  button {
    font-weight: bold;
  }
}
</style>
