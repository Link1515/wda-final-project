<template>
  <div id="userCenter" class="viewBox routerviewHeight" >
    <Title>
      <template #text>會員中心</template>
    </Title>
    <div class="subViewBox px-3 px-md-5">
      <div class="d-flex flex-column flex-lg-row align-items-start">
        <Menu :model="items" exact class="mb-5 mb-lg-0"/>
        <vue-page-transition name="fade" class="routerView py-3">
          <router-view />
        </vue-page-transition>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from 'primevue/menu'

export default {
  name: 'UserCenter',
  components: {
    Menu
  },
  data () {
    return {
      showSidebar: false,
      items: [
        {
          label: '會員資料',
          to: '/usercenter/editinfo'
        },
        {
          label: '修改密碼',
          to: '/usercenter/editpassword'
        },
        {
          label: '錯誤回報',
          to: '/usercenter/bugreport'
        }
      ]
    }
  },
  watch: {
    userInfo: {
      immediate: true,
      handler (newValue) {
        if (newValue.role === 'admin') {
          this.items = [this.items[0], this.items[1], { label: '會員管理', to: '/usercenter/manageuser' }, { label: '桌遊管理', to: '/usercenter/managegame' }, { label: '會員回報', to: '/usercenter/reportreview' }]
        }
      }
    }
  }
}
</script>

<style lang="scss">
#userCenter {
  padding: 0 2rem 6rem;

  .routerView {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #ffc107;
    flex-grow: 1;
    text-align: center;
    background-color: #fff5d8;
  }

  .router-link-active-exact {
    background-color: #ffc107;
  }
}

@media (min-width: 992px) {
  #userCenter {
    padding: 0 4rem 6rem;

    .routerView {
      background-color: #fff5d8;
    }
  }

}

@media (max-width: 993px) {
  #userCenter {
    .p-menu {
      width: 100%;
    }
  }
}
</style>
