<template>
  <div id="navbar">
    <Menubar :model="items">
      <template #start>
        <router-link to="/">
          <img class="logo" src="@/assets/images/logo.png">
        </router-link>
      </template>
      <template #end>
        <Button label="登入" class="p-button-rounded p-button-raised"/>
        <Button label="註冊" class="p-button-rounded p-button-raised ms-3"/>
      </template>
    </Menubar>
  </div>
</template>

<script>
import Menubar from 'primevue/menubar'

export default {
  name: 'Navbar',
  components: {
    Menubar
  },
  data () {
    return {
      items: [
        {
          label: '立即開始',
          to: '/play'
        },
        {
          label: '熱門遊戲'
        },
        {
          label: '關於我們'
        }
      ]
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
}
</style>
