<template>
  <div id="ManageUser">
    <div class="d-flex flex-column justify-content-center align-items-center mb-3">
      <h1>會員管理</h1>
      <div class="d-flex flex-column flex-lg-row align-items-center mb-5">
        <VueSelect
          v-model="searchType"
          :options="searchTypeList"
          :reduce="option => option.type"
          label="name" class="VueSelectWidth me-lg-2 flex-grow-1 mb-2 mb-lg-0"
          placeholder="選擇搜尋類型"
          style="background: #fff"
        />
        <InputText v-model="searchStr" @keydown.enter="searchUser" class="me-lg-2 flex-grow-1 mb-2 mb-lg-0"/>
        <Button icon="pi pi-search" @click="searchUser" class="p-button-rounded p-button-raised" />
      </div>
      <template v-if="gotUser">
        <div class="mb-3">
          <Avatar v-if="!gotUser.avatar" icon="pi pi-user" size="xlarge" shape="circle" />
          <Avatar v-else :image="gotUser.avatar" size="xlarge" shape="circle" />
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center mb-2">
          <span class="mb-2 mb-md-0">帳號</span>
          <InputText readonly :value="gotUser.account" class="ms-md-3 flex-grow-1"/>
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center mb-4">
          <span class="mb-2 mb-md-0">信箱</span>
          <InputText readonly :value="gotUser.email" class="ms-md-3 flex-grow-1"/>
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center">
          <Button label="重設密碼" v-tooltip.bottom="'將該用戶密碼重設為 0000'" class="p-button-rounded p-button-raised mb-2 mb-md-0 mx-md-2"/>
          <Button label="移除用戶" class="p-button-rounded p-button-raised p-button-danger mb-2 mb-md-0 mx-md-2"/>
        </div>
      </template>
    </div>
    <Toast position="top-center"/>
  </div>
</template>

<script>
export default {
  name: 'ManageUser',
  data () {
    return {
      searchTypeList: [
        { name: '玩家帳號', type: 'account' },
        { name: '玩家ID', type: 'id' }
      ],
      searchType: '',
      searchStr: '',
      searchResult: [],
      gotUser: null
    }
  },
  methods: {
    async searchUser () {
      try {
        if (!this.searchType) {
          this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇搜尋種類', life: 3000 })
          return
        }
        if (!this.searchStr) {
          this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫搜尋', life: 3000 })
          return
        }

        const { data } = await this.serverAPI.get('users/getUserBy' + this.searchType, {
          headers: {
            authorization: 'Bearer ' + this.userInfo.token
          },
          params: {
            searchStr: this.searchStr
          }
        })
        this.searchStr = ''
        this.gotUser = data.result
      } catch (error) {
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
