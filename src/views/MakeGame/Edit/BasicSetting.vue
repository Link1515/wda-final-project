<template>
  <div id="basicsetting">
    <div class="row justify-content-center g-3 subViewBox">
      <div class="col-9 col-xl-4 d-flex justify-content-center align-items-center flex-wrap flex-lg-nowrap">
        <label for="gameName" class="me-3 my-2">遊戲名稱 </label>
        <InputText id="gameName" v-model="name"></InputText>
      </div>
      <div class="col-9 col-xl-4 d-grid">
        <div class="d-flex flex-column align-items-xl-center flex-xl-row">
          <label class="me-3 mb-3 mb-xl-0">遊玩人數: <span class="playerNum">{{ playerRange[0] }}</span> ~ <span class="playerNum">{{ playerRange[1] }}</span> 人</label>
          <Slider class="flex-grow-1" v-model="playerRange" :range="true" :max="20" :min="2"></Slider>
        </div>
      </div>
      <!--
        設定陣營身分
      -->
      <div class="col-12 col-md-9 borderBox">
        <div class="d-flex justify-content-center flex-wrap mb-4">
          <label for="compRole" class="me-3 my-2">陣營身分 </label>
          <InputText
            @keydown.enter="addList('goodCompList', compRole)"
            @keydown.ctrl="addList('badCompList', compRole)"
            id="compRole"
            v-model="compRole.name"
            class="mb-2"
          ></InputText>
          <div>
            <Button
              @click="addList('goodCompList', compRole)"
              class="p-button-rounded ms-2 setBtn goodColor"
              v-tooltip.top="'Enter 鍵快速加入'"
            >設為好人</Button>
            <Button
              @click="addList('badCompList', compRole)"
              class="p-button-rounded ms-2 setBtn badColor"
              v-tooltip.top="'Ctrl 鍵快速加入'"
            >設為壞人</Button>
          </div>
        </div>
        <Textarea v-model="compRole.description" :autoResize="true" rows="5" placeholder="身分描述" />
        <hr class="my-4 mx-5">
        <!-- *********** good comp *********** -->
        <div class="goodComp mb-3 mx-5">
          <Accordion :multiple="true">
            <component :is="'AccordionTab'" v-for="role in goodCompList" :key="role.id" :header="role.name">
              <p>{{ role.description }}</p>
              <Textarea v-model="editModel.description" v-if="role.isEditing" :autoResize="true" rows="3" />
              <div class="AccordionTab_footer">
                <template v-if="!role.isEditing">
                  <Button label="編輯" @click="editList($event, 'goodCompList')" :data-target="role.id" class="p-button-rounded p-button-raised p-button-secondary ms-2" />
                  <Button label="刪除" @click="removeList($event, 'goodCompList')" :data-target="role.id" class="p-button-rounded p-button-raised p-button-danger ms-2" />
                </template>
                <template v-else>
                  <Button label="保存" @click="updateList($event, 'goodCompList')" :data-target="role.id" class="p-button-rounded p-button-raised p-button-success ms-2" />
                  <Button label="取消" @click="editList($event, 'goodCompList')" :data-target="role.id" class="p-button-rounded p-button-raised p-button-danger ms-2" />
                </template>
              </div>
            </component>
          </Accordion>
        </div>
        <!-- *********** bad comp *********** -->
        <div class="badComp mb-3 mx-5">
          <Accordion :multiple="true">
            <component :is="'AccordionTab'" v-for="role in badCompList" :key="role.id" :header="role.name">
              <p>{{ role.description }}</p>
              <div class="AccordionTab_footer">
                <Button label="刪除" @click="removeList($event, 'badCompList')" :data-removetarget="role.name" class="p-button-rounded p-button-raised p-button-danger" />
              </div>
            </component>
          </Accordion>
        </div>
      </div>
      <!--
        設定功能身分
      -->
      <div class="col-12 col-md-9 borderBox position-relative" :class="{disabled: !enableFunRole}">
        <div class="d-flex justify-content-center flex-wrap mb-4">
          <Checkbox class="funIdentityCheckbox" v-model="enableFunRole" binary/>
          <label for="funRole" class="me-3 my-2">功能身分 </label>
          <InputText
            @keydown.enter="addList('funRoleList', funRole)"
            id="funRole"
            v-model="funRole.name"
            class="mb-2 mb-lg-0"
            :disabled="!enableFunRole"
          ></InputText>
          <Button
            @click="addList('funRoleList', funRole)"
            class="p-button-rounded ms-2 setBtn"
            v-tooltip.top="'Enter 鍵快速加入'"
            :disabled="!enableFunRole"
          >設定</Button>
        </div>
        <Textarea v-model="funRole.description" :autoResize="true" rows="5" placeholder="身分描述" :disabled="!enableFunRole"/>
        <hr class="my-4 mx-5">
        <div class="funRole mb-2 mx-5">
          <Accordion :multiple="true">
            <component :is="'AccordionTab'" v-for="item in funRoleList" :key="item.id" :header="item.role">
              <p>{{ item.description }}</p>
              <div class="AccordionTab_footer">
                <Button label="刪除" @click="removeList($event, 'funRoleList')" :data-removetarget="item.role" :disabled="!enableFunRole" class="p-button-rounded p-button-raised p-button-danger" />
              </div>
            </component>
          </Accordion>
        </div>
      </div>
    </div>
    <Toast position="top-center"/>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider'
import Toast from 'primevue/toast'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

import { mapState } from 'vuex'

export default {
  components: {
    InputText,
    Slider,
    Checkbox,
    Toast,
    Textarea,
    Accordion,
    AccordionTab
  },
  data () {
    return {
      compRole: {
        name: '',
        description: ''
      },
      funRole: {
        name: '',
        description: ''
      },
      editModel: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    addList (listType, roleData) {
      if (!roleData.name) return
      for (const item of this[listType]) {
        if (item.role === roleData.name) {
          const detail = `${listType === 'goodCompList' ? '好人陣營' : listType === 'goodCompList' ? '壞人陣營' : '功能身分'} ${roleData.name} 已存在`
          this.$toast.add({ severity: 'error', summary: '錯誤', detail, life: 3000 })
          return
        }
      }
      this.$store.commit('game/addList', { listType, ...roleData })
      this.compRole.name = ''
      this.compRole.description = ''
      this.funRole.name = ''
      this.funRole.description = ''
    },
    removeList (e, listType) {
      const target = e.target.dataset.target
      this.$store.commit('game/removeList', { listType, target })
    },
    editList (e, listType) {
      const target = e.target.dataset.target
      this.$store.commit('game/editList', { listType, target })
      const editingData = this[listType].filter(item => item.id === target)[0]
      this.editModel.name = editingData.name
      this.editModel.description = editingData.description
    },
    updateList (e, listType) {
      const target = e.target.dataset.target
      this.$store.commit('game/updateList', { listType, target, ...this.editModel })
    }
  },
  computed: {
    name: {
      get () {
        return this.$store.state.game.name
      },
      set (value) {
        this.$store.commit('game/setName', value)
      }
    },
    playerRange: {
      get () {
        return this.$store.state.game.playerRange
      },
      set (value) {
        this.$store.commit('game/setPlayerRange', value)
      }
    },
    enableFunRole: {
      get () {
        return this.$store.state.game.enableFunRole
      },
      set (value) {
        this.$store.commit('game/setFunRoleState', value)
      }
    },
    ...mapState('game', ['goodCompList', 'badCompList', 'funRoleList'])
  }
}
</script>

<style lang="scss">
#basicsetting {
  text-align: center;

  .playerNum {
    padding: 0 10px;
    background-color: #FDD31C;
    border-radius: 9999px;
  }

  .setBtn {
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    border: none;
  }

  .goodColor,.goodComp .p-accordion-header-link{
    background-color: #a1dcff;
  }

  .badColor, .badComp .p-accordion-header-link{
    background-color: #ffc4c8;
  }

  .funColor, .funRole .p-accordion-header-link{
    background-color: #FDD31C;
  }

  .funIdentityCheckbox {
    position: absolute;
    left: 5px;
    top: 5px;
  }

  .disabled {
    filter: grayscale(1);
    background-color: #eee;
    input {
      background-color: #eee;
    }

    .funIdentityCheckbox::after {
      content: '勾選以啟用 "功能身分"';
      width: max-content;
      position: absolute;
      left: 150%;
    }
  }

  .p-inputtextarea {
    border-radius: 0;
    width: 80%;
  }

  .p-accordion-header-link:focus {
    box-shadow: none;
  }

  .AccordionTab_footer {
    text-align: right;

    span {
      pointer-events: none;
    }
  }
}
</style>
