<template>
  <div id="editInfo">
    <div class="d-flex flex-column justify-content-center align-items-center mb-3">
      <h1>會員資料</h1>
      <div class="mb-5" :class="{hideImgPreview: !newAvatar}">
        <div v-if="!newAvatar" style="margin-bottom: 1.5rem;">
          <Avatar v-if="!userInfo.avatar" icon="pi pi-user" size="xlarge" shape="circle" />
          <Avatar v-else :image="userInfo.avatar" size="xlarge" shape="circle" />
        </div>
        <ImageUploader
          :debug="0"
          :maxWidth="512"
          :maxSize="1"
          :quality="0.7"
          :autoRotate="true"
          outputFormat="file"
          :preview="true"
          capture="environment"
          accept="image/*"
          @input="imgInput"
        >
          <template #upload-label>
            <label for="fileInput">
              <div class="inputTitle mb-3">
                上傳照片
              </div>
            </label>
            <div class="inputTitle" @click="imgClear">清空</div>
          </template>
        </ImageUploader>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">暱稱</span>
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
import ImageUploader from 'vue-image-upload-resize'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  components: {
    ImageUploader
  },
  data () {
    return {
      sending: false,
      nickname: '',
      account: '',
      newAvatar: ''
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
        this.nickname !== this.userInfo.nickname ||
        this.newAvatar) {
          const result = await this.$swal({
            icon: 'warning',
            title: '是否要保存修改?',
            showCancelButton: true
          })
          if (result.isDismissed) return

          const fd = new FormData()
          fd.append('account', this.account)
          fd.append('nickname', this.nickname)
          if (this.newAvatar) {
            fd.append('image', this.newAvatar)
          }

          this.sending = true
          await this.serverAPI.patch('/users/editinfo', fd, {
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
          if (this.newAvatar) {
            this.$store.dispatch('user/updataAvatar')
            this.newAvatar = ''
          }
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
    },
    imgInput (file) {
      this.newAvatar = file
    },
    imgClear () {
      this.newAvatar = ''
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

<style lang="scss">
  #editInfo {
    #fileInput {
      display: none;
    }

    .hideImgPreview .img-preview {
      display: none;
    }

    .img-preview {
      margin-bottom: 1.5rem;
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 9999px;
    }

    .inputTitle {
      padding: 2px 5px;
      border: 1px solid #000;
      border-radius: 5px;
      cursor: pointer;
      transition: transform 0.5s;

      &:hover {
        transform: scale(1.2);
      }
    }
  }
</style>
