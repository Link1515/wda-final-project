<template>
  <div id="bugReport">
    <div class="d-flex flex-column justify-content-center align-items-center mb-3">
      <h1>錯誤回報</h1>
      <div class="d-flex flex-column flex-md-row align-items-center mb-3">
        <span class="mb-2 mb-md-0">標題</span>
        <InputText v-model="title" class="ms-md-3 flex-grow-1"/>
      </div>
      <Textarea v-model="text" placeholder="錯誤描述" style="width: 80%; height: 150px; resize: none; border-radius: 0"/>
    </div>
    <Button label="送出" @click="sendReport" :disabled="sending" class="p-button-rounded p-button-raised"/>
    <Toast position="top-center" />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      sending: false,
      title: '',
      text: ''
    }
  },
  validations: {
    title: { required },
    text: { required }
  },
  methods: {
    async sendReport () {
      try {
        this.$v.$touch()
        if (this.$v.$error) {
          if (this.$v.title.$error) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '標題不可為空', life: 3000 })
          } else if (this.$v.text.$error) {
            this.$toast.add({ severity: 'error', summary: '錯誤', detail: '內容不可為空', life: 3000 })
          }
          return
        }

        this.sending = true
        await this.serverAPI.post('/reports/createReport',
          {
            title: this.title,
            text: this.text
          }, {
            headers: {
              authorization: 'Bearer ' + this.userInfo.token
            }
          })
        this.sending = false

        this.$swal({
          icon: 'success',
          title: '成功',
          text: '送出成功'
        })
      } catch (error) {
        this.sending = false

        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: error.response.data.message
        })
      }
    }
  }
}
</script>

<style>

</style>
