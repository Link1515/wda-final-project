<template>
  <div id="makegame" class="viewBox routerviewHeight">
    <Title>
      <template #text>自製遊戲</template>
    </Title>
    <div class="row g-5" v-if="showMakegameHome">
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
          <div class="addNewGame" @click="addNewGame">
            <i class="pi pi-plus"></i>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 col-xl-3" v-for="game in userMadeGameList" :key="game._id">
          <Card>
            <template #header>
              <img v-if="game.image" :src="game.image" @click="editGame(game._id)">
              <img v-else src="@/assets/images/image-placeholder.png" @click="editGame(game._id)"/>
            </template>
            <template #title>
              {{ game.name }}
            </template>
          </Card>
        </div>

        <InfiniteLoading @infinite="infiniteHandler">
          <template #spinner>
            <div>載入中...</div>
          </template>
          <template #no-more>
            <div class="mt-4">資料已全部載入</div>
          </template>
          <template #no-results>
            <div class="mt-4">無資料</div>
          </template>
        </InfiniteLoading>
      </div>
    <router-view @updateList="updateList"/>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'MakeGame',
  components: {
    InfiniteLoading
  },
  data () {
    return {
      userMadeGameList: [],
      page: 1
    }
  },
  computed: {
    showMakegameHome () {
      return this.$route.path === '/makegame'
    },
    name () {
      return this.$store.state.game.name
    }
  },
  methods: {
    addNewGame () {
      this.$store.commit('game/reset')
      this.$router.push('/makegame/edit')
    },
    editGame (gameId) {
      this.$store.commit('game/reset')
      this.$store.dispatch('game/getOneGame', gameId)
      this.$router.push('/makegame/edit?loading=1')
    },
    async infiniteHandler ($state) {
      try {
        const { data } = await this.serverAPI.get('/games/getUserMadeGames', {
          headers: {
            authorization: 'Bearer ' + this.userInfo.token
          },
          params: {
            page: this.page
          }
        })
        if (data.result.length) {
          this.page++

          this.userMadeGameList.push(...data.result)
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
    },
    updateList () {
      this.userMadeGameList = []
      this.page = 1
    }
  }
}
</script>

<style lang="scss">
#makegame {
  padding: 0 2rem 6rem;

  .p-card-content {
    padding: 0;
  }

  .addNewGame {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 2rem 0;
    border: 5px dashed #000;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    i{
      font-size: 3rem;
      transition: transform .5s
    }

    &:hover i {
      transform: scale(1.2);
    }
  }

  .wizard-card-footer {
    justify-content: center;
    display: flex;
  }
}

@media (min-width: 768px) {
  #makegame {
    .wizard-card-footer {
      display: block;
    }
  }
}

@media (min-width: 992px) {
  #makegame {
    padding: 0 4rem 6rem;
  }
}
</style>
