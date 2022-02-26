<template>
  <div id="stepSetting">
    <div class="stepSetting_header">
      <Button @click="createStepList" label="新增流程" icon="pi pi-plus-circle" class="p-button-lg p-button-rounded p-button-raised mx-2 mb-2"/>
      <Button @click="showConfigPanel" label="新增步驟" icon="pi pi-plus-circle" class="p-button-lg p-button-rounded p-button-raised mx-2 mb-2"/>
    </div>
    <div class="invalidMsg" v-if="!$v.stepList.$each[0].rules.required && $v.stepList.$each[0].rules.$error" style="text-align: center">第一個流程至少需要一個步驟</div>
    <TabView @tab-change="changeStepListIndex" :activeIndex="stepListIndex">
      <TabPanel v-for="(step, index) in stepList" :header="step.name" :key="index">
        <div style="text-align: center">
          <span class="me-3">流程名稱</span>
          <InputText v-model.lazy="step.name" class="mb-3"/>
        </div>
        <Draggable
          tag="ul"
          v-model="step.rules"
          group="stepList"
          handle=".handle"
          :animation="300"
        >
          <transition-group>
            <li
              class="stepList"
              v-for="rule in $store.getters['game/stepListDisplayHelper'][stepListIndex].rules"
              :key="rule.id"
            >
              <Avatar :icon="rule.iconType" shape="circle" class="me-2" :style="{ background: rule.iconColor }"/>
              <span class="me-auto">{{ rule.mode }}</span>
              <p>
                <span v-if="rule.mode === '語音'">{{ rule.data }}</span>
                <span v-if="rule.mode === '計時'">{{ rule.data }} 秒</span>
                <span v-if="rule.mode === '顯示'">
                  執行角色: {{ rule.conductingRoleListName }} {{ rule.conductingRoleName }}
                  <br>
                  顯示角色: {{ rule.roleListName }} {{ rule.roleName }}
                  <br>
                  時間: {{ rule.data.timer }} 秒
                </span>
                <span v-if="rule.mode === '查驗'">
                  執行角色: {{ rule.conductingRoleListName }} {{ rule.conductingRoleName }}
                  <br>
                  時間: {{ rule.data.timer }} 秒
                </span>
                <span v-if="rule.mode === '標記'">
                  執行角色: {{ rule.conductingRoleListName }} {{ rule.conductingRoleName }}
                  <br>
                  標記: {{ rule.data.label }}
                  <br>
                  時間: {{ rule.data.timer }} 秒
                </span>
                <span v-if="rule.mode === '多選一'">
                  執行角色: {{ rule.conductingRoleListName }} {{ rule.conductingRoleName }}
                  <br>
                  <br>
                  此步驟後 {{ rule.data.spanStep }} 步為選項
                  <div v-for="(option, index) in rule.data.optionsData" :key="index" class="mb-1">
                    <span>選項{{ option.inc }}: {{ option.name }}</span>
                  </div>
                  <br>
                  時間: {{ rule.data.timer }} 秒
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
          class="trashCan ms-auto mt-5 mb-5"
        />
        <div style="text-align: center" v-if="index !== 0">
          <Button label="刪除流程" @click="deleteStepList(stepListIndex)" class="p-button-lg p-button-rounded p-button-raised p-button-danger"/>
        </div>
      </TabPanel>
    </TabView>

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
          v-if="configModel.mode === '語音'"
          v-model.trim="$v.configModel.audioText.$model"
          :autoResize="true"
          rows="5" cols="30"
        />
        <!-- ************** 計時 ************** -->
        <InputNumber
          v-if="configModel.mode === '計時'"
          v-model="configModel.countDown"
          showButtons buttonLayout="horizontal"
          :step="1"
          :min="1"
          :max="999"
          suffix=" 秒"
        />
        <!-- ************** 顯示 ************** -->
        <template v-if="configModel.mode === '顯示'">
          <p>執行角色</p>
          <Dropdown
            v-model="$v.configModel.showPlayer.conductingRoleListType.$model"
            :options="roleListType"
            optionLabel="name"
            optionValue="type"
            placeholder="選擇陣營"
          />
          <Dropdown
            v-if="configModel.showPlayer.conductingRoleListType && configModel.showPlayer.conductingRoleListType !== 'all'"
            v-model="$v.configModel.showPlayer.conductingRoleId.$model"
            :options="[{name: '全部', id: 'all'}, ...$store.state.game[configModel.showPlayer.conductingRoleListType]]"
            optionLabel="name"
            optionValue="id"
            placeholder="選擇執行角色"
          />
          <p>顯示角色</p>
          <Dropdown
            v-model="$v.configModel.showPlayer.roleListType.$model"
            :options="[...roleListType, { name: '標記結果', type: 'labelResult'}]"
            optionLabel="name"
            optionValue="type"
            placeholder="選擇陣營"
          />
          <Dropdown
            v-if="configModel.showPlayer.roleListType && configModel.showPlayer.roleListType !== 'all' && configModel.showPlayer.roleListType !== 'labelResult'"
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
        <!-- ************** 查驗 ************** -->
        <template v-if="configModel.mode === '查驗'">
          <p>執行角色</p>
          <Dropdown
            v-model="$v.configModel.checkPlayer.conductingRoleListType.$model"
            :options="roleListType"
            optionLabel="name"
            optionValue="type"
            placeholder="選擇陣營"
          />
          <Dropdown
            v-if="configModel.checkPlayer.conductingRoleListType && configModel.checkPlayer.conductingRoleListType !== 'all'"
            v-model="$v.configModel.checkPlayer.conductingRoleId.$model"
            :options="[{name: '全部', id: 'all'}, ...$store.state.game[configModel.checkPlayer.conductingRoleListType]]"
            optionLabel="name"
            optionValue="id"
            placeholder="選擇執行角色"
          />
          <p>時間</p>
          <InputNumber
            v-model="configModel.checkPlayer.timer"
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
        <!-- ************** 多選一 ************** -->
        <template v-if="configModel.mode === '多選一'">
          <p>執行角色</p>
          <Dropdown
            v-model="$v.configModel.pickOne.conductingRoleListType.$model"
            :options="roleListType"
            optionLabel="name"
            optionValue="type"
            placeholder="選擇陣營"
          />
          <Dropdown
            v-if="configModel.pickOne.conductingRoleListType && configModel.pickOne.conductingRoleListType !== 'all'"
            v-model="$v.configModel.pickOne.conductingRoleId.$model"
            :options="[{name: '全部', id: 'all'}, ...$store.state.game[configModel.pickOne.conductingRoleListType]]"
            optionLabel="name"
            optionValue="id"
            placeholder="選擇執行角色"
          />
          <p>N</p>
          <Dropdown
            v-model="$v.configModel.pickOne.spanStep.$model"
            :options="[2 ,3 ,4]"
            @change="buildPickOneOptName"
            placeholder="橫跨步驟數"
            class="mb-4"
          />
          <div v-for="(opt, index) in configModel.pickOne.optionsData" :key="index" style="text-align: center">
            <p>此步驟後的第{{ index + 1 }}個步驟</p>
            <InputText
              v-model.trim="$v.configModel.pickOne.optionsData.$each[index].name.$model"
              placeholder="選項名稱"
              class="mb-2"
            />
          </div>
          <p>時間</p>
          <InputNumber
            v-model="configModel.pickOne.timer"
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
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    Draggable,
    Dropdown,
    InputNumber,
    TabView,
    TabPanel
  },
  data () {
    return {
      displayConfig: false,
      stepListIndex: 0,
      deleteStep: [],
      configs: [
        { mode: '語音', intro: '透過語音撥放以下輸入的文字' },
        { mode: '計時', intro: '經過指定時間後，執行下一個步驟' },
        { mode: '顯示', intro: '顯示指定身分，只有執行角色能看到顯示的玩家' },
        { mode: '查驗', intro: '查驗指定玩家的身分' },
        { mode: '標記', intro: '執行時可以標記指定的玩家，需要自訂標籤，如: 死亡、警長保護...等' },
        { mode: '多選一', intro: '此步驟以後的 N 個步驟中，選一項執行' }
      ],
      configModel: {
        mode: '',
        audioText: '',
        countDown: 5,
        showPlayer: {
          conductingRoleListType: '',
          conductingRoleId: '',
          roleListType: '',
          roleId: '',
          timer: 5
        },
        checkPlayer: {
          conductingRoleListType: '',
          conductingRoleId: '',
          timer: 5
        },
        markPlayer: {
          conductingRoleListType: '',
          conductingRoleId: '',
          label: '',
          timer: 5
        },
        pickOne: {
          conductingRoleListType: '',
          conductingRoleId: '',
          spanStep: 2,
          optionsData: [{ inc: 1, name: '' }, { inc: 2, name: '' }],
          timer: 5
        }
      }
    }
  },
  validations: {
    configModel: {
      audioText: { required },
      countDown: { required },
      showPlayer: {
        conductingRoleListType: { required },
        conductingRoleId: { required },
        roleListType: { required },
        roleId: { required }
      },
      checkPlayer: {
        conductingRoleListType: { required },
        conductingRoleId: { required }
      },
      markPlayer: {
        conductingRoleListType: { required },
        conductingRoleId: { required },
        label: { required }
      },
      pickOne: {
        conductingRoleListType: { required },
        conductingRoleId: { required },
        spanStep: { required },
        optionsData: { $each: { name: { required } } }
      }
    },
    stepList: {
      $each: {
        rules: { required }
      }
    }
  },
  methods: {
    showConfigPanel () {
      this.displayConfig = true
    },
    createStepList () {
      this.$store.commit('game/createStepList')
      this.stepListIndex = this.stepList.length - 1
    },
    addStepList () {
      let data = null
      switch (this.configModel.mode) {
        case '語音':
          if (this.$v.configModel.audioText.$invalid) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫語音內容', life: 3000 })
            return
          }
          data = this.configModel.audioText
          break
        case '計時':
          if (this.$v.configModel.countDown.$invalid) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫計時時間', life: 3000 })
            return
          }
          data = this.configModel.countDown
          break
        case '顯示':
          if (this.$v.configModel.showPlayer.$invalid) {
            if (this.$v.configModel.showPlayer.conductingRoleListType.$invalid || this.$v.configModel.showPlayer.conductingRoleId.$invalid) {
              this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇執行角色', life: 3000 })
            }
            if (this.$v.configModel.showPlayer.roleListType.$invalid || this.$v.configModel.showPlayer.roleId.$invalid) {
              this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇顯示角色', life: 3000 })
            }
            return
          }
          data = this.configModel.showPlayer
          break
        case '查驗':
          if (this.$v.configModel.checkPlayer.$invalid) {
            if (this.$v.configModel.checkPlayer.conductingRoleListType.$invalid || this.$v.configModel.checkPlayer.conductingRoleId.$invalid) {
              this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇執行角色', life: 3000 })
            }
            if (this.$v.configModel.markPlayer.label.$invalid) {
              this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫標籤', life: 3000 })
            }
            return
          }
          data = this.configModel.checkPlayer
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
        case '多選一':
          if (this.$v.configModel.pickOne.$invalid) {
            if (this.$v.configModel.pickOne.conductingRoleListType.$invalid || this.$v.configModel.pickOne.conductingRoleId.$invalid) {
              this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇執行角色', life: 3000 })
            }
            if (this.$v.configModel.pickOne.optionsData.$invalid) {
              this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫選項名稱', life: 3000 })
            }
            return
          }
          data = this.configModel.pickOne
          break
      }
      this.displayConfig = false

      this.$store.commit('game/addStepList', { stepListIndex: this.stepListIndex, mode: this.configModel.mode, data })

      this.configModel = {
        mode: '',
        audioText: '',
        countDown: 5,
        showPlayer: {
          conductingRoleListType: '',
          conductingRoleId: '',
          roleListType: '',
          roleId: '',
          timer: 5
        },
        checkPlayer: {
          conductingRoleListType: '',
          conductingRoleId: '',
          timer: 5
        },
        markPlayer: {
          conductingRoleListType: '',
          conductingRoleId: '',
          label: '',
          timer: 5
        },
        pickOne: {
          conductingRoleListType: '',
          conductingRoleId: '',
          spanStep: 2,
          optionsData: [{ inc: 1, name: '' }, { inc: 2, name: '' }],
          timer: 5
        }
      }
    },
    async deleteStepList (index) {
      const result = await this.$swal({
        icon: 'warning',
        title: '是否確定刪除?',
        showCancelButton: true
      })
      if (result.isDismissed) return

      this.$store.commit('game/deleteStepList', index)
      this.stepListIndex = this.stepList.length - 1
    },
    changeStepListIndex (e) {
      this.stepListIndex = e.index
    },
    buildPickOneOptName () {
      this.configModel.pickOne.optionsData = []
      for (let i = 0; i < this.configModel.pickOne.spanStep; i++) {
        this.configModel.pickOne.optionsData.push({ inc: i + 1, name: '' })
      }
    },
    async validate () {
      this.$v.stepList.$touch()
      if (this.$v.stepList.$each[0].rules.$error) {
        this.$toast.add({ severity: 'error', summary: '錯誤', detail: '缺少必要項目', life: 3000 })
      } else if (this.$v.stepList.$error) {
        const result = await this.$swal({
          icon: 'warning',
          title: '是否要刪除沒有步驟的流程?',
          showCancelButton: true
        })
        if (result.isConfirmed) {
          this.stepList = this.stepList.filter(step => step.rules.length !== 0)
        }
      }
      this.stepListIndex = 0

      return !this.$v.stepList.$each[0].rules.$error
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
        if (config.showPlayer.conductingRoleListType === 'all') {
          config.showPlayer.conductingRoleId = 'all'
        }
        if (config.showPlayer.roleListType === 'all' || config.showPlayer.roleListType === 'labelResult') {
          config.showPlayer.roleId = 'all'
        }
        if (config.checkPlayer.conductingRoleListType === 'all') {
          config.checkPlayer.conductingRoleId = 'all'
        }
        if (config.markPlayer.conductingRoleListType === 'all') {
          config.markPlayer.conductingRoleId = 'all'
        }
        if (config.pickOne.conductingRoleListType === 'all') {
          config.pickOne.conductingRoleId = 'all'
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
    min-height: 250px;
  }

  .p-dropdown,
  .p-inputtextarea {
    width: 100%;
  }

  .p-dialog-content {
    padding: 1.5rem;
  }

  .p-dialog-footer {
    margin-top: -3px;
    text-align: center;
  }

  .p-inputnumber-input {
    border-radius: 0;
  }

  .p-tabview {
    border-radius: 8px;
    overflow: hidden;
  }
}

.stepSetting_header {
  text-align: center;
  margin-bottom: 2rem;

  button {
    font-weight: bold;
  }
}

.p-dialog-content {
  min-height: 250px;
}
</style>
