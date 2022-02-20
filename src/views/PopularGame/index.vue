<template>
  <div id="populargame" class="viewBox routerviewHeight">
    <Title>
      <template #text>
        熱門遊戲
      </template>
    </Title>
    <div class="row g-5">
      <div class="col-12 col-md-6 col-lg-4 col-xl-3" v-for="game in gameList" :key="game._id">
        <Card>
          <template #header>
            <img v-if="game.image" :src="game.image" @click="showDialog(game._id)">
            <img v-else src="@/assets/images/image-placeholder.png" @click="showDialog(game._id)"/>
          </template>
          <template #title>
            {{ game.name }}
          </template>
          <template #content>
            <Rating :value="countStar(game.likes)" :readonly="true" :cancel="false"/>
          </template>
          <template #footer>
            <ToggleButton v-model="game.likedByUser" @change="setFavGame(game.likedByUser, game._id, game.name)" onIcon="pi pi-heart-fill" offIcon="pi pi-heart"/>
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

    <Dialog :visible.sync="dialogDisplay" position="center" :showHeader="false" modal dismissableMask>
      <div style="max-height: 70vh">
        <img v-if="image" :src="image">
        <img v-else src="@/assets/images/image-placeholder.png"/>
        <div class="dialogText">
          <h1>{{ name }}</h1>
          <h4>遊玩人數: {{ playerRange[0] }} ~ {{ playerRange[1] }}</h4>
          <p>{{ description }}</p>
          <p>好人陣營: <span v-for="role in goodCampRoleList" :key="role.id">{{ role.name }} / </span></p>
          <p>壞人陣營: <span v-for="role in badCampRoleList" :key="role.id">{{ role.name }} / </span></p>
          <p v-if="enableFunRole">功能身分: <span v-for="role in funRoleList" :key="role.id">{{ role.name }} / </span></p>
        </div>
        <div class="dialogStep">
          <h2>遊戲步驟</h2>
          <StepList :list="stepList"/>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Rating from 'primevue/rating'
import ToggleButton from 'primevue/togglebutton'
import InfiniteLoading from 'vue-infinite-loading'

import { mapState } from 'vuex'
import StepList from '@/components/StepList'

export default {
  name: 'PopularGame',
  components: {
    Rating,
    ToggleButton,
    InfiniteLoading,
    StepList
  },
  data () {
    return {
      dialogDisplay: false,
      page: 1,
      gameList: []
    }
  },
  methods: {
    showDialog (gameId) {
      this.$store.dispatch('game/getOneGame', gameId)
      this.dialogDisplay = !this.dialogDisplay
    },
    countStar (likes) {
      return Math.round((likes / this.mostLike) * 5)
    },
    setFavGame (isFav, gameId, gameName) {
      if (isFav) {
        this.$store.dispatch('user/addFavGame', { gameId, gameName })
      } else {
        this.$store.dispatch('user/removeFavGame', gameId)
      }
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

          for (const game of data.result) {
            game.likedByUser = false
            for (const FG of favGame) {
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
  },
  computed: {
    mostLike () {
      return this.gameList[0].likes
    },
    ...mapState('game', ['name', 'description', 'image', 'playerRange', 'goodCampRoleList', 'badCampRoleList', 'enableFunRole', 'funRoleList', 'stepList'])
  }
}
</script>

<style lang="scss">
#populargame {
  padding: 0 2rem 6rem;

  .p-card-content {
    padding: 0;
  }

  .p-card-title {
    text-overflow : ellipsis;
    white-space : nowrap;
    overflow: hidden;
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

@media (min-width: 992px) {
  #populargame {
    padding: 0 4rem 6rem;
  }
}
</style>
