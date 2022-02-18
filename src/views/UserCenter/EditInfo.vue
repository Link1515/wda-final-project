<template>
  <div id="editInfo">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <h1>會員資料</h1>
      <div class="mb-5">
        <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">暱稱</span>
        <InputText v-model="playerNickname" class="ms-md-3 flex-grow-1"/>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">帳號</span>
        <InputText v-model="playerAccount" class="ms-md-3 flex-grow-1"/>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">信箱</span>
        <InputText v-model="playerEmail" class="ms-md-3 flex-grow-1"/>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'primevue/avatar'

export default {
  components: {
    Avatar
  },
  data () {
    return {
      playerNickname: '',
      playerAccount: '',
      playerEmail: ''
    }
  },
  created () {
    this.playerAccount = this.userInfo.account
    this.playerEmail = this.userInfo.email
  }
}
</script>

<style>

</style>
