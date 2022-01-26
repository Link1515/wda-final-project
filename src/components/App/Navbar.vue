<template>
  <div id="navbar">
    <Menubar :model="navItems">
      <template #start>
        <router-link to="/">
          <img class="logo" src="@/assets/images/logo.png">
        </router-link>
      </template>
      <template #end>
        <Button label="登入" class="p-button-rounded p-button-raised" @click="showLoginModel(0)" v-if="!userInfo.isLogin"/>
        <Button label="註冊" class="p-button-rounded p-button-raised ms-3" @click="showLoginModel(1)" v-if="!userInfo.isLogin"/>
        <Button label="登出" class="p-button-rounded p-button-raised ms-3" @click="logout" v-if="userInfo.isLogin"/>
      </template>
    </Menubar>

    <Dialog :visible.sync="displayPanel" @hide="resetSubmitted" :showHeader="false" modal dismissableMask>
      <TabView :activeIndex="tabActiveIndex">
        <TabPanel header="登入">
          <form class="p-fluid" @submit.prevent="login">
            <span class="p-float-label">
              <InputText id="login_username" type="text" v-model.trim="loginData.account" :class="{'p-invalid': loginInvalid.account}"/>
              <label for="login_username">帳號</label>
            </span>
            <span class="p-float-label">
              <InputText id="login_password" type="password" v-model.trim="loginData.password" autocomplete :class="{'p-invalid': loginInvalid.password}"/>
              <label for="login_password">密碼</label>
            </span>
            <Button label="登入" class="p-button-rounded p-button-warning" type="submit" />
          </form>
        </TabPanel>
        <TabPanel header="註冊">
          <form class="p-fluid" @submit.prevent="register">
            <span class="p-float-label">
              <InputText id="register_email" type="text" v-model.trim="registerData.email" :class="{'p-invalid': registerInvalid.email}"/>
              <label for="register_email">信箱</label>
            </span>
            <span class="p-float-label">
              <InputText id="register_username" type="text" v-model.trim="registerData.account" :class="{'p-invalid': registerInvalid.account}"/>
              <label for="register_username">帳號</label>
            </span>
            <span class="p-float-label">
              <InputText id="register_password" type="password" v-model.trim="registerData.password" autocomplete :class="{'p-invalid': registerInvalid.password}"/>
              <label for="register_password">密碼</label>
            </span>
            <span class="p-float-label">
              <InputText id="register_passwordAgain" type="password" v-model.trim="registerData.passwordAgain" autocomplete :class="{'p-invalid': registerInvalid.passwordAgain}"/>
              <label for="register_passwordAgain">再次輸入密碼</label>
            </span>
            <Button label="註冊" class="p-button-rounded p-button-warning" type="submit"/>
          </form>
        </TabPanel>
      </TabView>
    </Dialog>
  </div>
</template>

<script>
import Menubar from 'primevue/menubar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'

import validator from 'validator'

export default {
  name: 'Navbar',
  components: {
    Menubar,
    TabView,
    TabPanel,
    InputText
  },
  data () {
    return {
      displayPanel: false,
      loginData: {
        account: '',
        password: ''
      },
      registerData: {
        email: '',
        account: '',
        password: '',
        passwordAgain: ''
      },
      navItems: [
        {
          label: '立即開始',
          to: '/play'
        },
        {
          label: '熱門遊戲',
          to: '/populargame'
        },
        {
          label: '關於我們'
        }
      ],
      tabActiveIndex: 0,
      submitted: {
        login: false,
        register: false
      }
    }
  },
  methods: {
    showLoginModel (tabIndex) {
      this.tabActiveIndex = tabIndex
      this.displayPanel = !this.displayPanel
    },
    login () {
      this.submitted.login = true
      for (const key in this.loginInvalid) {
        // 有認證錯誤就 return
        if (this.loginInvalid[key]) return
      }

      this.$store.dispatch('user/login', this.loginData)
      this.loginData.account = ''
      this.loginData.password = ''
    },
    register () {
      this.submitted.register = true
      for (const key in this.registerInvalid) {
        if (this.registerInvalid[key]) return
      }

      this.$store.dispatch('user/register', this.registerData)
      this.registerData.email = ''
      this.registerData.account = ''
      this.registerData.password = ''
      this.registerData.passwordAgain = ''
    },
    logout () {
      this.$store.dispatch('user/logout')
      this.$router.push('/')
    },
    resetSubmitted () {
      this.submitted.login = false
      this.submitted.register = false
    }
  },
  computed: {
    loginInvalid () {
      return {
        account: !this.loginData.account.length > 0 && this.submitted.login,
        password: !this.loginData.password.length > 0 && this.submitted.login
      }
    },
    registerInvalid () {
      return {
        email: !validator.isEmail(this.registerData.email) && this.submitted.register,
        account: !this.registerData.account.length > 0 && this.submitted.register,
        password: !this.registerData.password.length > 0 && this.submitted.register,
        passwordAgain: this.registerData.password !== this.registerData.passwordAgain && this.submitted.register
      }
    }
  },
  watch: {
    userInfo: {
      immediate: true,
      handler (newValue) {
        if (newValue.isLogin) {
          this.navItems = [...this.navItems, { label: '自製遊戲', to: '/makegame' }]
          this.displayPanel = false
        } else {
          this.navItems = [this.navItems[0], this.navItems[1], this.navItems[2]]
        }
      }
    }
  }
}
</script>

<style lang="scss">
#navbar {
  color: #000;
  font-weight: 600;
  border-radius: 12px 12px 0 0;
  overflow: hidden;

  .logo{
    height: 50px;
  }

// ----- p-menubar -----
  .p-menubar {
    border-radius: 0;
    border: none;
    padding: 1rem 3rem;
  }

  .p-menubar-start {
    margin-right: auto;
  }

  .p-menubar-end {
    margin-left: 2rem;
  }

  .p-menuitem-text,
  .p-button-label {
    color: #000;
    font-weight: 500;
  }

  .p-menuitem-icon {
    display: none !important;
  }

  .router-link-active-exact{
    background-color: var(--color-bg);
    span {
      color: #fff;
    }
  }

//  ----- p-dialog -----
  .p-dialog {
    width: 400px;
    margin-top: -10rem !important;
  }

  .p-dialog-content {
    padding-top: 32px;
  }

// ----- p-tabview -----
  .p-tabview-nav {
    justify-content: center;
  }

  .p-tabview-nav-link {
    box-shadow: none;
  }

  .p-tabview-title {
    color: #000;
  }

// ----- form -----

  .p-float-label {
    margin: 2rem 0;
  }
}
</style>
