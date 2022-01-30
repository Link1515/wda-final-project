<template>
  <div id="basicsetting">
    <div class="row justify-content-center g-3 subViewBox">
      <div class="col-9 col-xl-4 d-flex justify-content-center align-items-center flex-wrap flex-lg-nowrap">
        <label for="gameName" class="me-3 my-2" style="white-space: nowrap;">桌遊名稱</label>
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
            @keydown.enter="addRoleList('goodCompRoleList', compRole)"
            @keydown.ctrl="addRoleList('badCompRoleList', compRole)"
            id="compRole"
            v-model="compRole.name"
            class="mb-2"
          ></InputText>
          <div>
            <Button
              @click="addRoleList('goodCompRoleList', compRole)"
              class="p-button-rounded ms-2 setBtn goodColor"
              v-tooltip.top="'Enter 鍵快速加入'"
              tabindex="-1"
            >設為好人</Button>
            <Button
              @click="addRoleList('badCompRoleList', compRole)"
              class="p-button-rounded ms-2 setBtn badColor"
              v-tooltip.top="'Ctrl 鍵快速加入'"
              tabindex="-1"
            >設為壞人</Button>
          </div>
        </div>
        <Textarea v-model="compRole.description" :autoResize="true" rows="5" placeholder="身分描述" />
        <hr class="my-4 mx-5">
        <RoleList listType="goodCompRoleList" class="goodComp mb-3 mx-5"/>
        <RoleList listType="badCompRoleList" class="badComp mb-3 mx-5"/>
      </div>
      <!--
        設定功能身分
      -->
      <div class="col-12 col-md-9 borderBox position-relative" :class="{disabled: !enableFunRole}">
        <div class="d-flex justify-content-center flex-wrap mb-4">
          <Checkbox class="funIdentityCheckbox" v-model="enableFunRole" binary/>
          <label for="funRole" class="me-3 my-2">功能身分 </label>
          <InputText
            @keydown.enter="addRoleList('funRoleList', funRole)"
            id="funRole"
            v-model="funRole.name"
            class="mb-2 mb-lg-0"
            :disabled="!enableFunRole"
          ></InputText>
          <Button
            @click="addRoleList('funRoleList', funRole)"
            class="p-button-rounded ms-2 setBtn"
            v-tooltip.top="'Enter 鍵快速加入'"
            :disabled="!enableFunRole"
          >設定</Button>
        </div>
        <Textarea v-model="funRole.description" :autoResize="true" rows="5" placeholder="身分描述" :disabled="!enableFunRole"/>
        <hr class="my-4 mx-5">
        <RoleList listType="funRoleList" class="funRole mb-3 mx-5" v-show="enableFunRole"/>
      </div>
    </div>

    <!-- toast -->
    <Toast position="top-center"/>
  </div>
</template>

<script>
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider'
import Toast from 'primevue/toast'

import RoleList from './RoleList'

import { mapState } from 'vuex'

export default {
  components: {
    Slider,
    Checkbox,
    Toast,
    RoleList
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
      }
    }
  },
  methods: {
    addRoleList (listType, roleData) {
      if (!roleData.name) {
        this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未輸入名稱', life: 3000 })
        return
      }
      const listTypeTC = listType === 'goodCompRoleList' ? '好人陣營' : listType === 'badCompRoleList' ? '壞人陣營' : '功能身分'
      for (const item of this[listType]) {
        if (item.name === roleData.name) {
          this.$toast.add({ severity: 'error', summary: '錯誤', detail: `${listTypeTC} ${roleData.name} 已存在`, life: 3000 })
          return
        }
      }
      this.$store.commit('game/addRoleList', { listType, ...roleData })
      this.$toast.add({ severity: 'success', summary: '成功', detail: `${roleData.name} 成功加入 ${listTypeTC}`, life: 3000 })
      this.compRole.name = ''
      this.compRole.description = ''
      this.funRole.name = ''
      this.funRole.description = ''
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
    ...mapState('game', ['goodCompRoleList', 'badCompRoleList', 'funRoleList'])
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
}
</style>
