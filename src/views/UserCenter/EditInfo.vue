<template>
  <div id="editInfo">
    <div class="d-flex flex-column justify-content-center align-items-center mb-3">
      <h1>會員資料</h1>
      <div class="mb-5">
        <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0" v-tooltip.right="'遊戲中的預設名稱，沒有填寫的話會採用帳號'">暱稱</span>
        <InputText v-model="nickname" @keydown.enter="updateAndSave" maxlength="10" class="ms-md-3 flex-grow-1"/>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">帳號</span>
        <InputText v-model="account" @keydown.enter="updateAndSave" class="ms-md-3 flex-grow-1"/>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">信箱</span>
        <InputText readonly :value="userInfo.email" v-tooltip.right="'信箱不可修改'" class="ms-md-3 flex-grow-1"/>
      </div>
    </div>
    <Button label="保存修改" @click="updateAndSave" :disabled="sending" class="p-button-rounded p-button-raised"/>
    <Toast position="top-center" />
  </div>
</template>

<script>
import Avatar from 'primevue/avatar'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  components: {
    Avatar
  },
  data () {
    return {
      sending: false,
      nickname: '',
      account: ''
    }
  },
  validations: {
    account: {
      required,
      minLength: minLength(4)
    }
  },
  methods: {
    async updateAndSave () {
      try {
        if (this.sending) return

        this.$v.$touch()
        if (this.$v.account.$error) {
          if (!this.$v.account.required) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '帳號不可為空', life: 3000 })
          } else if (!this.$v.account.minLength) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '帳號最小長度為4', life: 3000 })
          }
          return
        }

        if (this.account !== this.userInfo.account ||
        this.nickname !== this.userInfo.nickname) {
          this.sending = true
          await this.serverAPI.patch('/users/editinfo', { nickname: this.nickname, account: this.account }, {
            headers: {
              authorization: 'Bearer ' + this.userInfo.token
            }
          })
          this.sending = false

          this.$swal({
            icon: 'success',
            title: '成功',
            text: '修改成功'
          })

          this.$store.commit('user/updateUserInfo', { nickname: this.nickname, account: this.account })
        } else {
          this.$toast.add({ severity: 'error', summary: '錯誤', detail: '資料無修改', life: 3000 })
        }
      } catch (error) {
        this.sending = false
        this.$swal({
          icon: 'error',
          title: '失敗',
          text: error.response.data.message
        })
      }
    }
  },
  created () {
    this.account = this.userInfo.account
    if (this.userInfo.nickname) {
      this.nickname = this.userInfo.nickname
    }
  }
}
</script>

<style>

</style>
