<template>
  <div id="navbar">
    <Menubar :model="navItems">
      <template #start>
        <router-link to="/">
          <img class="logo" src="@/assets/images/logo.png">
        </router-link>
      </template>
      <template #end>
        <Button label="登入" class="p-button-rounded p-button-raised" @click="showLoginModel"/>
        <Button label="註冊" class="p-button-rounded p-button-raised ms-3" @click="showLoginModel"/>
      </template>
    </Menubar>

    <Dialog :visible.sync="isLogin" :showHeader="false" modal dismissableMask>
      <TabView>
        <TabPanel header="登入">
          <form class="p-fluid" @submit.prevent="login">
            <span class="p-float-label">
              <InputText id="login_username" type="text" v-model="loginData.account" />
              <label for="login_username">帳號</label>
            </span>
            <span class="p-float-label">
              <InputText id="login_password" type="password" v-model="loginData.password" autocomplete/>
              <label for="login_password">密碼</label>
            </span>
            <Button label="登入" class="p-button-rounded p-button-warning" type="submit" />
          </form>
        </TabPanel>
        <TabPanel header="註冊">
          <form class="p-fluid" @submit.prevent="register">
            <span class="p-float-label">
              <InputText id="register_email" type="text" v-model="registerData.email"/>
              <label for="register_email">信箱</label>
            </span>
            <span class="p-float-label">
              <InputText id="register_username" type="text" v-model="registerData.account" />
              <label for="register_username">帳號</label>
            </span>
            <span class="p-float-label">
              <InputText id="register_password" type="password" v-model="registerData.password" autocomplete/>
              <label for="register_password">密碼</label>
            </span>
            <span class="p-float-label">
              <InputText id="register_passwordAgain" type="password" v-model="registerData.passwordAgain" autocomplete/>
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
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'

export default {
  name: 'Navbar',
  components: {
    Menubar,
    Dialog,
    TabView,
    TabPanel,
    InputText
  },
  data () {
    return {
      isLogin: false,
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
      loginItem: [
        { label: '登入' },
        { label: '註冊' }
      ]
    }
  },
  methods: {
    showLoginModel () {
      this.isLogin = !this.isLogin
    },
    login () {
      this.loginData.account = ''
      this.loginData.password = ''
    },
    register () {
      this.registerData.email = ''
      this.registerData.account = ''
      this.registerData.password = ''
      this.registerData.passwordAgain = ''
    }
  },
  computed: {
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
