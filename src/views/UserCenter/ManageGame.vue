<template>
  <div id="ManageGame">
    <div class="d-flex flex-column justify-content-center align-items-center mb-3">
      <h1>桌遊管理</h1>
      <div class="d-flex flex-column flex-lg-row align-items-center mb-5">
        <VueSelect
          v-model="searchType"
          :options="searchTypeList"
          :reduce="option => option.type"
          label="name" class="VueSelectWidth me-lg-2 flex-grow-1 mb-2 mb-lg-0"
          placeholder="選擇搜尋類型"
          style="background: #fff"
        />
        <InputText v-model="searchText" @keydown.enter="searchGame" class="me-lg-2 flex-grow-1 mb-2 mb-lg-0"/>
        <Button icon="pi pi-search" @click="searchGame" class="p-button-rounded p-button-raised" />
      </div>
      <template v-if="gotGame">
        <div class="mx-auto mb-3" style="max-width: 600px">
          <img v-if="gotGame.image" :src="gotGame.image">
          <img v-else src="@/assets/images/image-placeholder.png">
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center mb-2">
          <span class="mb-2 mb-md-0">作者 ID</span>
          <InputText readonly :value="gotGame.author" class="ms-md-3 flex-grow-1"/>
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center mb-4">
          <span class="mb-2 mb-md-0">桌遊名稱</span>
          <InputText readonly :value="gotGame.name" class="ms-md-3 flex-grow-1"/>
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center">
          <Button label="移除桌遊" @click="deleteGame" class="p-button-rounded p-button-raised p-button-danger mb-2 mb-md-0 mx-md-2"/>
        </div>
      </template>
    </div>
    <Toast position="top-center"/>
  </div>
</template>

<script>
export default {
  name: 'ManageGame',
  data () {
    return {
      searchTypeList: [
        { name: '桌遊名稱', type: 'name' },
        { name: '桌遊 ID', type: 'id' }
      ],
      searchType: '',
      searchText: '',
      gotGame: null
    }
  },
  methods: {
    async searchGame () {
      try {
        if (!this.searchType) {
          this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未選擇搜尋種類', life: 3000 })
          return
        }
        if (!this.searchText) {
          this.$toast.add({ severity: 'error', summary: '錯誤', detail: '未填寫搜尋', life: 3000 })
          return
        }

        if (this.searchType === 'name') {
          const { data } = await this.serverAPI.get('games/getGameByName/' + this.searchText, {
            headers: {
              authorization: 'Bearer ' + this.userInfo.token
            }
          })
          this.gotGame = data.result
        } else if (this.searchType === 'id') {
          const { data } = await this.serverAPI.get('games/getGameById/' + this.searchText, {
            headers: {
              authorization: 'Bearer ' + this.userInfo.token
            }
          })
          this.gotGame = data.result
        }

        this.searchText = ''
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: error.response.data.message
        })
      }
    },
    async deleteGame () {
      try {
        this.serverAPI.delete('/games/deleteGameById/' + this.gotGame._id, {
          headers: {
            authorization: 'Bearer ' + this.userInfo.token
          }
        })

        this.gotGame = null

        this.$swal({
          icon: 'success',
          title: '成功',
          text: '移除成功'
        })
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
