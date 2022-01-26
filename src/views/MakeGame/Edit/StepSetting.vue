<template>
  <div id="stepSetting">
    <div class="stepSetting_header">
      <Button @click="showConfigPanel" label="新增流程" icon="pi pi-plus-circle" class="p-button-lg p-button-rounded p-button-raised"/>
    </div>
    <Draggable
      tag="ul"
      v-model="stepList"
      :animation="300"
    >
      <transition-group>
        <li
          class="list-group-item"
          v-for="step in stepList"
          :key="step.id"
        >
          <Avatar :icon="step.icon" shape="circle" class="me-2" :style="{background: step.iconColor}"/>
          <span>{{ step.mode }}</span>
          <p>{{ step.audioText || step.timer || step.playerLabel }}</p>
        </li>
      </transition-group>
    </Draggable>

    <Dialog :visible.sync="displayConfig" :showHeader="false" modal dismissableMask>
      <form class="configForm d-flex flex-column align-items-center">
        <Dropdown
          v-model="configForm.mode"
          :options="configs"
          optionLabel="name"
          optionValue="name"
          :filter="true"
          placeholder="選擇模式"
        />
        <p v-show="configForm.mode">{{ configIntro }}</p>
        <Textarea
          v-model.trim="configForm.audioText"
          v-show="configForm.mode === '語音'"
          :autoResize="true"
          rows="5" cols="30"
        />
        <InputNumber
          v-model="configForm.timer"
          v-show="configForm.mode === '計時器'"
          showButtons buttonLayout="horizontal"
          :step="1"
          :min="1"
          :max="999"
          suffix=" 秒"
        />
        <InputText
          v-model.trim="configForm.playerLabel"
          v-show="configForm.mode === '標記玩家'"
          placeholder="自訂標籤"
        />
      </form>
      <template #footer>
        <Button @click="addStep" :disabled="!canAdd" v-show="configForm.mode" label="添加" class="p-button-rounded p-button-raised"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Avatar from 'primevue/avatar'

export default {
  components: {
    Draggable,
    Dropdown,
    Textarea,
    InputNumber,
    InputText,
    Avatar
  },
  data () {
    return {
      stepList: [
        {
          id: Date.now(),
          mode: '語音',
          audioText: '天黑請閉眼',
          icon: 'pi pi-volume-up',
          iconColor: '#EED19C'
        }
      ],
      displayConfig: false,
      configs: [
        { name: '語音', intro: '透過語音撥放以下輸入的文字' },
        { name: '計時器', intro: '間隔設定時間後，執行下一個步驟' },
        { name: '標記玩家', intro: '執行時可以標記指定的玩家，需要自訂標籤，如: 死亡、警長保護...等' }
      ],
      configForm: {
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
    addStep () {
      const newStep = { id: Date.now(), mode: this.configForm.mode }
      switch (newStep.mode) {
        case '語音':
          newStep.audioText = this.configForm.audioText
          newStep.icon = 'pi pi-volume-up'
          newStep.iconColor = '#EED19C'
          break
        case '計時器':
          newStep.timer = this.configForm.timer + ' 秒'
          newStep.icon = 'pi pi-clock'
          newStep.iconColor = '#ACBA9D'
          break
        case '標記玩家':
          newStep.playerLabel = this.configForm.playerLabel
          newStep.icon = 'pi pi-user-edit'
          newStep.iconColor = '#E8837E'
          break
      }
      this.stepList.push(newStep)
    }
  },
  computed: {
    configIntro () {
      const matchConfig = this.configs.filter(config => config.name === this.configForm.mode)
      return matchConfig[0]?.intro
    }
  },
  watch: {
    configForm: {
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
      font-size: 1.2rem;
      text-align: center;
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
