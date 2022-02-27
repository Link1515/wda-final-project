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

    <Dialog :visible.sync="displayPanel" @hide="resetForm" :showHeader="false" modal dismissableMask>
      <TabView :activeIndex="tabActiveIndex">
        <!--
          登入
        -->
        <TabPanel header="登入">
          <form class="p-fluid" @submit.prevent="login">
            <span class="p-float-label mb-1">
              <InputText id="login_username" type="text" v-model.trim="loginData.account" :class="{'p-invalid': $v.loginData.account.$error}"/>
              <label for="login_username">帳號</label>
            </span>
            <template v-if="$v.loginData.account.$error">
              <div class="invalidMsg" v-if="!$v.loginData.account.required">帳號必填</div>
              <div class="invalidMsg" v-if="!$v.loginData.account.minLength">帳號最小長度為 {{$v.loginData.account.$params.minLength.min}}</div>
            </template>
            <span class="p-float-label mb-1">
              <InputText id="login_password" type="password" v-model.trim="loginData.password" autocomplete :class="{'p-invalid': $v.loginData.password.$error}"/>
              <label for="login_password">密碼</label>
            </span>
            <template v-if="$v.loginData.password.$error">
              <div class="invalidMsg" v-if="!$v.loginData.password.required">密碼必填</div>
            </template>
            <Button label="登入" class="p-button-rounded p-button-warning mt-3" type="submit" />
          </form>
        </TabPanel>
        <!--
          註冊
        -->
        <TabPanel header="註冊">
          <form class="p-fluid" @submit.prevent="register">
            <span class="p-float-label mb-1">
              <InputText id="register_email" type="text" v-model.trim="registerData.email" :class="{'p-invalid': $v.registerData.email.$error }"/>
              <label for="register_email">信箱</label>
            </span>
            <template v-if="$v.registerData.email.$error">
              <div class="invalidMsg" v-if="!$v.registerData.email.required">信箱必填</div>
              <div class="invalidMsg" v-if="!$v.registerData.email.email">信箱格式錯誤</div>
            </template>
            <span class="p-float-label mb-1">
              <InputText id="register_username" type="text" v-model.trim="$v.registerData.account.$model" :class="{'p-invalid': $v.registerData.account.$error}"/>
              <label for="register_username">帳號</label>
            </span>
            <template v-if="$v.registerData.account.$error">
              <div class="invalidMsg" v-if="!$v.registerData.account.required">帳號必填</div>
              <div class="invalidMsg" v-if="!$v.registerData.account.minLength">帳號最小長度為 {{$v.registerData.account.$params.minLength.min}}</div>
            </template>
            <span class="p-float-label mb-1">
              <InputText id="register_password" type="password" v-model.trim="registerData.password" autocomplete :class="{'p-invalid': $v.registerData.password.$error}"/>
              <label for="register_password">密碼</label>
            </span>
            <template v-if="$v.registerData.password.$error">
              <div class="invalidMsg" v-if="!$v.registerData.password.required">密碼必填</div>
            </template>
            <span class="p-float-label mb-1">
              <InputText id="register_passwordAgain" type="password" v-model.trim="$v.registerData.passwordAgain.$model" autocomplete :class="{'p-invalid': $v.registerData.passwordAgain.$error}"/>
              <label for="register_passwordAgain">再次輸入密碼</label>
            </span>
            <template v-if="$v.registerData.passwordAgain.$error">
              <div class="invalidMsg" v-if="!$v.registerData.passwordAgain.sameAsPassword">密碼不相同</div>
            </template>
            <Button label="註冊" class="p-button-rounded p-button-warning mt-3" type="submit"/>
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

import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'Navbar',
  components: {
    Menubar,
    TabView,
    TabPanel
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
        }
      ],
      tabActiveIndex: 0
    }
  },
  validations: {
    loginData: {
      account: {
        required,
        minLength: minLength(4)
      },
      password: {
        required
      }
    },
    registerData: {
      email: {
        required,
        email
      },
      account: {
        required,
        minLength: minLength(4)
      },
      password: {
        required
      },
      passwordAgain: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    showLoginModel (tabIndex) {
      this.tabActiveIndex = tabIndex
      this.displayPanel = !this.displayPanel
    },
    login () {
      this.$v.loginData.$touch()
      if (!this.$v.loginData.$invalid) {
        this.$store.dispatch('user/login', this.loginData)
        this.$v.loginData.$reset()
        this.loginData.password = ''
      }
    },
    register () {
      this.$v.registerData.$touch()
      if (!this.$v.registerData.$invalid) {
        this.$store.dispatch('user/register', this.registerData)
        this.$v.registerData.$reset()
        this.registerData.email = ''
        this.registerData.account = ''
        this.registerData.password = ''
        this.registerData.passwordAgain = ''
      }
    },
    logout () {
      this.$store.dispatch('user/logout')
      this.$router.push('/')
    },
    resetForm () {
      this.$v.loginData.$reset()
      this.loginData.account = ''
      this.loginData.password = ''
      this.$v.registerData.$reset()
      this.registerData.email = ''
      this.registerData.account = ''
      this.registerData.password = ''
      this.registerData.passwordAgain = ''
    }
  },
  computed: {
    gaming () {
      return this.$store.state.room.roomId.length > 0
    },
    currentRoute () {
      return this.$route
    }
  },
  watch: {
    userInfo: {
      immediate: true,
      handler (newValue) {
        if (newValue.isLogin) {
          const pageStr = this.userInfo.role === 'admin' ? '管理中心' : '會員中心'
          this.navItems = [this.navItems[0], this.navItems[1],
            { label: '自製遊戲', to: '/makegame' }, { label: pageStr, to: '/usercenter' }]
          this.displayPanel = false
          this.loginData.account = ''
          this.loginData.password = ''
        } else {
          this.navItems = [this.navItems[0], this.navItems[1]]
        }
      }
    },
    gaming (val) {
      if (val) {
        this.navItems.shift()
        this.navItems.unshift({ label: '返回遊戲', to: '/room' })
      } else {
        this.navItems.shift()
        this.navItems.unshift({ label: '立即開始', to: '/play' })
      }
    },
    currentRoute: {
      deep: true,
      handler (route) {
        if (route.query?.login === '0') {
          this.displayPanel = true
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

  .logo{
    height: 50px;
  }

// ----- p-menubar -----
  .p-menubar {
    border-radius: 8px 8px 0 0;
    border: none;
    padding: 1rem;
  }

  .p-menubar-start {
    margin-right: auto;
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

// ----- p-inputtext -----
  .p-inputtext+label {
    margin-left: 0.5rem;
  }

// ----- form -----

  .p-float-label {
    margin: 2rem 0;
  }
}

@media (min-width: 768px) {
  #navbar {
    .p-menubar {
      padding: 1rem 3rem;
    }

    .p-menubar-end {
      margin-left: 2rem;
    }
  }
}
</style>
