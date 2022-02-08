<template>
  <div id="stepSetting">
    <div class="stepSetting_header">
      <Button @click="showConfigPanel" label="新增流程" icon="pi pi-plus-circle" class="p-button-lg p-button-rounded p-button-raised"/>
    </div>
    <div class="error" v-if="!$v.stepList.required && $v.stepList.$error" style="text-align: center">至少需要一個步驟</div>
    <Draggable
      tag="ul"
      v-model="stepList"
      group="stepList"
      handle=".handle"
      :animation="300"
    >
      <transition-group>
        <li
          class="stepList"
          v-for="step in $store.getters['game/stepListDisplayHelper']"
          :key="step.id"
        >
          <Avatar :icon="step.iconType" shape="circle" class="me-2" :style="{ background: step.iconColor }"/>
          <span class="me-auto">{{ step.mode }}</span>
          <p>
            <span v-if="step.mode === '語音'">{{ step.data }}</span>
            <span v-if="step.mode === '顯示'">
              顯示角色: {{ step.roleListName }} {{ step.roleName }}
              <br>
              時間: {{ step.data.timer }} 秒
            </span>
            <span v-if="step.mode === '標記'">
              執行角色: {{ step.conductingRoleListName }} {{ step.conductingRoleName }}
              <br>
              標記: {{ step.data.label }}
              <br>
              時間: {{ step.data.timer }} 秒
            </span>
            <i class="pi pi-bars handle"></i>
          </p>
        </li>
      </transition-group>
    </Draggable>
    <Draggable
      tag="ul"
      v-model="deleteStep"
      group="stepList"
      class="trashCan ms-auto mt-5"
    />

    <!-- add step panel -->
    <Dialog :visible.sync="displayConfig" :showHeader="false" modal dismissableMask>
      <form class="configForm d-flex flex-column align-items-center pb-5">
        <Dropdown
          v-model="configModel.mode"
          :options="configs"
          optionLabel="mode"
          optionValue="mode"
          placeholder="選擇模式"
        />
        <p v-show="configModel.mode">{{ configIntro }}</p>
        <!-- ************** 語音 ************** -->
        <Textarea
          v-model.trim="$v.configModel.audioText.$model"
          v-show="configModel.mode === '語音'"
          :autoResize="true"
          rows="5" cols="30"
        />
        <!-- ************** 顯示 ************** -->
        <template v-if="configModel.mode === '顯示'">
          <p>顯示角色</p>
          <Dropdown
            v-model="$v.configModel.showPlayer.roleListType.$model"
            :options="roleListType"
            optionLabel="name"
            optionValue="type"
            placeholder="選擇陣營"
          />
          <Dropdown
            v-if="configModel.showPlayer.roleListType && configModel.showPlayer.roleListType !== 'all'"
            v-model="$v.configModel.showPlayer.roleId.$model"
            :options="[{name: '全部', id: 'all'}, ...$store.state.game[configModel.showPlayer.roleListType]]"
            optionLabel="name"
            optionValue="id"
            placeholder="選擇顯示角色"
          />
          <p>時間</p>
          <InputNumber
            v-model="configModel.showPlayer.timer"
            showButtons buttonLayout="horizontal"
            :step="1"
            :min="1"
            :max="999"
            suffix=" 秒"
          />
        </template>
        <!-- ************** 標記 ************** -->
        <template v-if="configModel.mode === '標記'">
          <p>執行角色</p>
          <Dropdown
            v-model="$v.configModel.markPlayer.conductingRoleListType.$model"
            :options="roleListType"
            optionLabel="name"
            optionValue="type"
            placeholder="選擇陣營"
          />
          <Dropdown
            v-if="configModel.markPlayer.conductingRoleListType && configModel.markPlayer.conductingRoleListType !== 'all'"
            v-model="$v.configModel.markPlayer.conductingRoleId.$model"
            :options="[{name: '全部', id: 'all'}, ...$store.state.game[configModel.markPlayer.conductingRoleListType]]"
            optionLabel="name"
            optionValue="id"
            placeholder="選擇執行角色"
          />
          <p>標籤</p>
          <InputText
            v-model.trim="$v.configModel.markPlayer.label.$model"
            placeholder="自訂標籤"
          />
          <p>時間</p>
          <InputNumber
            v-model="configModel.markPlayer.timer"
            showButtons buttonLayout="horizontal"
            :step="1"
            :min="1"
            :max="999"
            suffix=" 秒"
          />
        </template>
      </form>
      <template #footer>
        <Button @click="addStepList" v-show="configModel.mode" label="添加" class="p-button-rounded p-button-raised"/>
      </template>
    </Dialog>

    <!-- toast -->
    <Toast position="top-center" />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Avatar from 'primevue/avatar'
import Toast from 'primevue/toast'

import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    Draggable,
    Dropdown,
    InputNumber,
    Avatar,
    Toast
  },
  data () {
    return {
      displayConfig: false,
      deleteStep: [],
      configs: [
        { mode: '語音', intro: '透過語音撥放以下輸入的文字' },
        { mode: '顯示', intro: '顯示指定身分' },
        { mode: '標記', intro: '執行時可以標記指定的玩家，需要自訂標籤，如: 死亡、警長保護...等' }
      ],
      configModel: {
        mode: '',
        audioText: '',
        showPlayer: {
          roleListType: '',
          roleId: '',
          timer: 5
        },
        markPlayer: {
          conductingRoleListType: '',
          conductingRoleId: '',
          label: '',
          timer: 5
        }
      }
    }
  },
  validations: {
    configModel: {
      audioText: { required },
      showPlayer: {
        roleListType: { required },
        roleId: { required }
      },
      markPlayer: {
        conductingRoleListType: { required },
        conductingRoleId: { required },
        label: { required }
      }
    },
    stepList: {
      required
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
          if (this.$v.configModel.audioText.$invalid) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫語音內容', life: 3000 })
            return
          }
          data = this.configModel.audioText
          break
        case '顯示':
          if (this.$v.configModel.showPlayer.$invalid) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇顯示角色', life: 3000 })
            return
          }
          data = this.configModel.showPlayer
          break
        case '標記':
          if (this.$v.configModel.markPlayer.$invalid) {
            if (this.$v.configModel.markPlayer.conductingRoleListType.$invalid || this.$v.configModel.markPlayer.conductingRoleId.$invalid) {
              this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇執行角色', life: 3000 })
            }
            if (this.$v.configModel.markPlayer.label.$invalid) {
              this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫標籤', life: 3000 })
            }
            return
          }
          data = this.configModel.markPlayer
          break
      }
      this.displayConfig = false

      this.$store.commit('game/addStepList', { mode: this.configModel.mode, data })

      this.configModel = {
        mode: '',
        audioText: '',
        showPlayer: {
          roleListType: '',
          roleId: '',
          timer: 5
        },
        markPlayer: {
          conductingRoleListType: '',
          conductingRoleId: '',
          label: '',
          timer: 5
        }
      }
    },
    validate () {
      this.$v.stepList.$touch()
      return !this.$v.stepList.$error
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
    },
    roleListType () {
      if (this.$store.state.game.enableFunRole) {
        return [
          { type: 'all', name: '所有人' },
          { type: 'goodCampRoleList', name: '好人陣營' },
          { type: 'badCampRoleList', name: '壞人陣營' },
          { type: 'funRoleList', name: '功能身分' }
        ]
      }
      return [
        { type: 'all', name: '所有人' },
        { type: 'goodCampRoleList', name: '好人陣營' },
        { type: 'badCampRoleList', name: '壞人陣營' }
      ]
    }
  },
  watch: {
    configModel: {
      deep: true,
      handler (config) {
        if (config.showPlayer.roleListType === 'all') {
          config.showPlayer.roleId = 'all'
        }
        if (config.markPlayer.conductingRoleListType === 'all') {
          config.markPlayer.conductingRoleId = 'all'
        }
      }
    }
  }
}
</script>

<style lang="scss">
#stepSetting {
  .error {
    color: red
  }

  textarea {
    border-radius: 0 !important;
  }

  .stepList {
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

  .trashCan {
    padding: 0;
    width: 200px;
    min-height: 2rem;
    transition: .5s;
    background: url('~@/assets/images/trashCan.png') no-repeat center / contain;
    p {
      display: none;
    }
    li {
      opacity: 0.8;
      background-color: #f66 !important;
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
