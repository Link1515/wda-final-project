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
        <div class="mt-4">無資料</div>
      </template>
    </InfiniteLoading>

    <Dialog :visible.sync="dialogDisplay" @hide="stepIndex = ''" position="center" :showHeader="false" modal dismissableMask>
      <div style="max-height: 70vh; max-width: 800px">
        <img v-if="image" :src="image">
        <img v-else src="@/assets/images/image-placeholder.png"/>
        <div class="dialogText mb-5">
          <h1>{{ name }}</h1>
          <h4>遊玩人數: {{ playerRange[0] }} ~ {{ playerRange[1] }}</h4>
          <p style="max-width: 800px; padding: 0 2rem">{{ description }}</p>
          <div class="goodCamp" style="display: inline-block">好人陣營</div>
          <p>
            <span v-for="(role, index) in goodCampRoleList" :key="role.id">{{ role.name }}<span v-if="index !== goodCampRoleList.length - 1"> / </span></span>
          </p>
          <div class="badCamp" style="display: inline-block">壞人陣營</div>
          <p>
            <span v-for="(role, index) in badCampRoleList" :key="role.id">{{ role.name }}<span v-if="index !== badCampRoleList.length - 1"> / </span></span>
          </p>
          <div v-if="enableFunRole" class="funRole" style="display: inline-block">功能身分</div>
          <p v-if="enableFunRole">
            <span v-for="(role, index) in funRoleList" :key="role.id">{{ role.name }}<span v-if="index !== funRoleList.length - 1"> / </span></span>
          </p>
        </div>
        <div class="dialogStep pb-5">
          <h1 class="mb-3">遊戲流程</h1>
          <VueSelect
            v-model="stepIndex"
            :options="stepListDisplayHelper"
            :reduce="s => stepListDisplayHelper.findIndex(step => step.id === s.id)"
            label="name" placeholder="選擇流程" class="VueSelectWidth mx-auto mb-4"
          />
          <h2 v-if="stepListDisplayHelper[stepIndex]" class="stepHeader">{{ stepListDisplayHelper[stepIndex].name }}</h2>
          <StepList v-if="stepListDisplayHelper[stepIndex]" :data="stepListDisplayHelper[stepIndex].rules"/>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Rating from 'primevue/rating'
import ToggleButton from 'primevue/togglebutton'
import InfiniteLoading from 'vue-infinite-loading'
import StepList from '@/components/StepList.vue'

import { mapState, mapGetters } from 'vuex'

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
      stepIndex: '',
      page: 1,
      gameList: []
    }
  },
  methods: {
    showDialog (gameId) {
      this.$store.commit('game/reset')
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
        console.log(data.result)
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
          console.log('loaded')
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
    ...mapState('game', ['name', 'description', 'image', 'playerRange', 'goodCampRoleList', 'badCampRoleList', 'enableFunRole', 'funRoleList', 'stepList']),
    ...mapGetters('game', ['stepListDisplayHelper'])
  }
}
</script>

<style lang="scss">
#populargame {
  padding: 0 2rem 6rem;

  .stepHeader {
    width: max-content;
    margin: 1rem auto;
    padding: 5px 10px;
    border-radius: 9999px;
    background-color: #ffc107;
  }

  .goodCamp,
  .badCamp,
  .funRole {
    border-radius: 9999px;
    padding: 5px 10px;
  }

  .goodCamp {
    background-color: #a1dcff;
  }

  .badCamp {
    background-color: #ffc4c8;
  }

  .funRole {
    background-color: #FDD31C;
  }

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

    img {
      max-height: 75vh;
      object-fit: contain;
    }
  }
}

@media (min-width: 992px) {
  #populargame {
    padding: 0 4rem 6rem;
  }
}
</style>
