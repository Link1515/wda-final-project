<template>
  <div id="makegame" class="viewBox">
    <Title>
      <template #text>自製遊戲</template>
    </Title>
    <div class="row g-5" v-show="showMakegameHome">
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
      </div>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'MakeGame',
  data () {
    return {
      userMadeGameList: []
    }
  },
  computed: {
    showMakegameHome () {
      return this.$route.path === '/makegame'
    }
  },
  methods: {
    addNewGame () {
      this.$store.commit('game/reset')
      this.$router.push('/makegame/edit')
    },
    editGame (gameId) {
      this.$store.dispatch('game/getOneGame', gameId)
      this.$router.push('/makegame/edit')
    }
  },
  async created () {
    try {
      const { data } = await this.serverAPI.get('/games/getUserMadeGames', {
        headers: {
          authorization: 'Bearer ' + this.userInfo.token
        }
      })
      this.userMadeGameList = data.result
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得桌遊失敗'
      })
    }
  }
}
</script>

<style lang="scss">
#makegame {
  padding: 0 4rem 6rem;

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
}
</style>
