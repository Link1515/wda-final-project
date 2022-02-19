<template>
  <div id="editPassword">
    <div class="d-flex flex-column justify-content-center align-items-center mb-3">
      <h1>修改密碼</h1>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">原密碼</span>
        <InputText type="password" v-model="oldPassword" @keydown.enter="updateAndSave" class="ms-md-3 flex-grow-1"/>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">新密碼</span>
        <InputText type="password" v-model="newPassword" @keydown.enter="updateAndSave" class="ms-md-3 flex-grow-1"/>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">再次輸入新密碼</span>
        <InputText type="password" v-model="newPasswordAgain" @keydown.enter="updateAndSave" class="ms-md-3 flex-grow-1"/>
      </div>
    </div>
    <Button label="保存修改" @click="updateAndSave" :disabled="sending" class="p-button-rounded p-button-raised"/>
    <Toast position="top-center" />
  </div>
</template>

<script>
import { required, sameAs } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      sending: false,
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: ''
    }
  },
  validations: {
    oldPassword: { required },
    newPassword: { required },
    newPasswordAgain: { required, sameAsPassword: sameAs('newPassword') }
  },
  methods: {
    async updateAndSave () {
      try {
        if (this.sending) return

        this.$v.$touch()
        if (this.$v.$error) {
          if (!this.$v.oldPassword.required) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫原密碼', life: 3000 })
          } else if (!this.$v.newPassword.required) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫新密碼', life: 3000 })
          } else if (!this.$v.newPasswordAgain.required) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未再次輸入新密碼', life: 3000 })
          } else if (!this.$v.newPasswordAgain.sameAsPassword) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '新密碼與再次輸入不同', life: 3000 })
          }
          return
        }

        const result = await this.$swal({
          icon: 'warning',
          title: '是否要保存修改?',
          showCancelButton: true
        })
        if (result.isDismissed) return

        this.sending = true
        await this.serverAPI.patch('/users/editpassword', {
          account: this.userInfo.account,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }, {
          headers: {
            authorization: 'Bearer ' + this.userInfo.token
          }
        })
        this.sending = false

        this.oldPassword = ''
        this.newPassword = ''
        this.newPasswordAgain = ''

        this.$swal({
          icon: 'success',
          titel: '成功',
          text: '成功修改密碼'
        })
      } catch (error) {
        this.sending = false
        this.$swal({
          icon: 'error',
          titel: '錯誤',
          text: error.response.data.message
        })
      }
    }
  }
}
</script>

<style>

</style>
