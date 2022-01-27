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
            v-model="compRole"
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
        <Textarea v-model="compRoleDescription" :autoResize="true" rows="5" placeholder="身分描述" />
        <hr class="my-4 mx-5">
        <div class="goodComp mb-2 mx-5">
          <component :is="'Chip'" v-for="item in goodCompList" :key="item.id" :label="item.role" class="goodColor me-2 mb-2" removable @remove="removeList($event, 'goodCompList')" style="font-weight: bold"></component>
          <Accordion :multiple="true">
            <component :is="'AccordionTab'" v-for="item in goodCompList" :key="item.id" :header="item.role">{{ item.role }}</component>
          </Accordion>
        </div>
        <div class="badComp mb-2 mx-5">
          <component :is="'Chip'" v-for="item in badCompList" :key="item.id" :label="item.role" class="badColor me-2 mb-2" removable @remove="removeList($event, 'badCompList')" style="font-weight: bold"></component>
          <Accordion :multiple="true">
            <component :is="'AccordionTab'" v-for="item in badCompList" :key="item.id" :header="item.role">{{ item.role }}</component>
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
            v-model="funRole"
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
        <Textarea v-model="funRoleDescription" :autoResize="true" rows="5" placeholder="身分描述" :disabled="!enableFunRole"/>
        <hr class="my-4 mx-5">
        <div class="funRole mb-2">
          <component :is="'Chip'" v-for="item in funRoleList" :key="item.id" :label="item.role" class="funColor me-2 mb-2" :removable="enableFunRole" @remove="removeList($event, 'funRoleList')" style="font-weight: bold;"></component>
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
import Chip from 'primevue/chip'
import Toast from 'primevue/toast'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

import { mapState } from 'vuex'

export default {
  components: {
    InputText,
    Slider,
    Chip,
    Checkbox,
    Toast,
    Textarea,
    Accordion,
    AccordionTab
  },
  data () {
    return {
      // compRole: {
      //   name: '',
      //   description: ''
      // },
      compRole: '',
      compRoleDescription: '',
      funRole: '',
      funRoleDescription: ''
    }
  },
  methods: {
    addList (listKey, value) {
      if (!value) return
      for (const item of this[listKey]) {
        if (item.role === value) {
          const detail = `${listKey === 'goodCompList' ? '好人陣營' : listKey === 'goodCompList' ? '壞人陣營' : '功能身分'} ${value} 已存在`
          this.$toast.add({ severity: 'error', summary: '錯誤', detail, life: 3000 })
          return
        }
      }
      this.$store.commit('game/addList', { listKey, value })
      this.compRole = ''
      this.funRole = ''
    },
    removeList (e, listKey) {
      const removeTargetValue = e.target.previousSibling.textContent
      this.$store.commit('game/removeList', { listKey, value: removeTargetValue })
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

  .funColor{
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
}
</style>
