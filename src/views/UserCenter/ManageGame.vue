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
        <Button icon="pi pi-search" @click="searchGame" :disabled="sending" class="p-button-rounded p-button-raised" />
      </div>
    </div>
    <DataTable v-if="gotGames.length > 0" stripedRows :value="gotGames">
      <Column field="image" header="圖片" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          <img v-if="slotProps.data.image" :src="slotProps.data.image" style="width: 100px">
          <img v-else src="@/assets/images/image-placeholder.png" style="width: 100px">
        </template>
      </Column>
      <Column field="name" header="名稱" :bodyStyle="{ textAlign: 'center' }" />
      <Column header="作者 ID" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          <span class="authorId">{{ slotProps.data.author }}</span>
        </template>
      </Column>
      <Column header="操作" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          <Button label="移除桌遊" @click="deleteGame(slotProps.data._id)" class="p-button-rounded p-button-raised p-button-danger"/>
        </template>
      </Column>
    </DataTable>
    <Toast position="top-center"/>
  </div>
</template>

<script>
export default {
  name: 'ManageGame',
  data () {
    return {
      sending: false,
      searchTypeList: [
        { name: '桌遊名稱', type: 'name' },
        { name: '桌遊 ID', type: 'id' }
      ],
      searchType: '',
      searchText: '',
      gotGames: []
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

        this.sending = true
        if (this.searchType === 'name') {
          const { data } = await this.serverAPI.get('games/getGameByName/' + this.searchText, {
            headers: {
              authorization: 'Bearer ' + this.userInfo.token
            }
          })
          this.gotGames = data.result
        } else if (this.searchType === 'id') {
          const { data } = await this.serverAPI.get('games/getGameById/' + this.searchText, {
            headers: {
              authorization: 'Bearer ' + this.userInfo.token
            }
          })
          this.gotGames = [data.result]
        }

        this.searchText = ''
        this.sending = false
      } catch (error) {
        this.sending = false
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: error.response.data.message
        })
      }
    },
    async deleteGame (gameId) {
      try {
        const result = await this.$swal({
          icon: 'warning',
          title: '是否確定要移除?',
          showCancelButton: true
        })
        if (result.isDismissed) return

        this.serverAPI.delete('/games/deleteGameById/' + gameId, {
          headers: {
            authorization: 'Bearer ' + this.userInfo.token
          }
        })

        this.gotGames = []

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

<style lang="scss">
#ManageGame {
  .p-column-header-content {
    justify-content: center;
  }

  .authorId {
    font-size: 10px;
  }
}

@media (min-width: 768px) {
  #ManageGame {
    .authorId {
      font-size: 1rem;
    }
  }
}
</style>
