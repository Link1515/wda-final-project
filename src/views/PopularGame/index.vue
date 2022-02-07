<template>
  <div id="populargame" class="viewBox">
    <Title>
      <template #text>
        熱門遊戲
      </template>
    </Title>
    <div class="row g-5">
      <div class="col-12 col-md-6 col-lg-4 col-xl-3" v-for="(game, index) in gameList" :key="game._id">
        <Card>
          <template #header>
            <img v-if="game.image" :src="game.image" @click="showDialog(index)">
            <img v-else src="@/assets/images/image-placeholder.png" @click="showDialog(index)"/>
          </template>
          <template #title>
            {{ game.name }}
          </template>
          <template #content>
            <Rating v-model="val" :readonly="true" :cancel="false"/>
          </template>
          <template #footer>
            <ToggleButton v-model="game.likedByUser" @change="setFavGame(game.likedByUser, game._id)" onIcon="pi pi-heart-fill" offIcon="pi pi-heart"/>
          </template>
        </Card>
      </div>
    </div>

    <InfiniteLoading @infinite="infiniteHandler">
      <template #spinner>
        <div>載入中...</div>
      </template>
      <template #no-more>
        <div class="mt-4">資料已全部載入</div>
      </template>
      <template #no-results>
        <div class="mt-4">載入失敗</div>
      </template>
    </InfiniteLoading>

    <Dialog @show="loadData" :visible.sync="dialogDisplay" position="center" :showHeader="false" modal dismissableMask >
      <div style="width: 600px">
        <img v-if="dialogData.image" :src="dialogData.image">
        <img v-else src="@/assets/images/image-placeholder.png"/>
        <p>{{ dialogData.description }}</p>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Rating from 'primevue/rating'
import ToggleButton from 'primevue/togglebutton'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'PopularGame',
  components: {
    Rating,
    ToggleButton,
    InfiniteLoading
  },
  data () {
    return {
      val: 3,
      liked: false,
      dialogDisplay: false,
      dialogData: {
        gameIndex: '',
        image: '',
        description: ''
      },
      page: 1,
      gameList: []
    }
  },
  methods: {
    showDialog (gameIndex) {
      this.dialogData.gameIndex = gameIndex
      this.dialogDisplay = !this.dialogDisplay
    },
    setFavGame (isFav, gameId) {
      if (isFav) {
        this.$store.dispatch('user/addFavGame', gameId)
      } else {
        this.$store.dispatch('user/removeFavGame', gameId)
      }
    },
    loadData () {
      this.dialogData.image = this.gameList[this.dialogData.gameIndex].image
      this.dialogData.description = this.gameList[this.dialogData.gameIndex].description
    },
    async infiniteHandler ($state) {
      try {
        const { data } = await this.serverAPI.get('/games', {
          params: {
            page: this.page
          }
        })
        if (data.result.length) {
          this.page++
          const favGame = JSON.parse(JSON.stringify(this.userInfo.favoriteGame))

          for (const FG of favGame) {
            for (const game of data.result) {
              game.likedByUser = false
              if (game._id === FG.game) {
                game.likedByUser = true
                break
              }
            }
          }

          this.gameList.push(...data.result)
          $state.loaded()
        } else {
          $state.complete()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '失敗',
          text: '取得失敗'
        })
      }
    }
  }
}
</script>

<style lang="scss">
#populargame {
  padding: 0 4rem 6rem;

  .p-card-content {
    padding: 0;
  }

  .p-button {
    border: none;
  }

  .p-button:focus {
    box-shadow: none;
  }

  .p-button:hover {
    background-color: transparent;
  }

  .p-button-icon {
    font-size: 2rem;
    color: #F06771;
  }

  .p-highlight {
    background-color: transparent;
  }

  .p-dialog {
    border-radius: 10px;
    overflow: hidden;

    .p-dialog-content {
      padding-left: 0;
      padding-right: 0;
      text-align: center;
    }
  }
}
</style>
