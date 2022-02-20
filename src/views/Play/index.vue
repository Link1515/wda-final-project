<template>
  <div id="play" class="viewBox routerviewHeight">
    <template v-if="showPlayHome">
      <Title>
        <template #text>
          立即開始！
        </template>
      </Title>
      <div class="row g-5 justify-content-evenly">
        <div class="col-md-8 col-lg-5 col-xxl-4">
          <div @click="createGame">
            <Card class="createGame">
              <template #header>
                <FontAwesomeIcon :icon="['fas','gamepad']" size="10x"></FontAwesomeIcon>
              </template>
              <template #footer>
                <div class="play_texticon py-2">
                  創建遊戲
                </div>
              </template>
            </Card>
          </div>
        </div>
        <div class="col-md-8 col-lg-5 col-xxl-4 mb-5">
          <div @click="joinGame">
            <Card class="joinGame">
              <template #header>
                <FontAwesomeIcon :icon="['fas','running']" size="10x" transform="filp-h"></FontAwesomeIcon>
              </template>
              <template #footer>
                <div class="play_texticon py-2">
                  加入遊戲
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
      <Card class="col-md-8 mx-auto">
        <template #title>
          說明
        </template>
        <template #content>
          <p>創建遊戲: 從收藏桌遊中選擇桌遊，並創建遊戲間</p>
          <p>加入遊戲: 向創建遊戲的房主取得遊戲間ID，即可加入遊戲</p>
        </template>
      </Card>
    </template>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'play',
  methods: {
    createGame () {
      this.$router.push('/play/creategame').catch(() => {})
    },
    joinGame () {
      this.$router.push('/play/joingame').catch(() => {})
    },
    backToGame () {
      this.$router.push('/room').catch(() => {})
    }
  },
  computed: {
    showPlayHome () {
      return this.$route.path === '/play'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$socket.connected) {
        next('/room')
      } else {
        next()
      }
    })
  }
}
</script>

<style lang="scss">
#play {
  padding: 0 2rem 6rem;

  .createGame,
  .joinGame {
    cursor: pointer;

    svg {
      transition: .5s;
    }

    &:hover svg {
      transform: scale(1.1);
    }

    .p-card-header {
      padding: 3rem 0;
      display: grid;
      place-items: center;
    }

    .p-card-body {
      padding: 0;
    }

    .p-card-content {
      display: none;
    }
  }

  .play_texticon {
    background-color: var(--color-bg);
    color: #fff;
    font-weight: 600;
    font-size: 2rem;
    letter-spacing: 1rem;
  }
}

@media (min-width: 768px) {
  #play {
      padding: 0 4rem 6rem;
  }
}

@media (min-width: 1200px) {
  #play {
    .p-card-header {
      padding: 5rem 0;
    }
  }
}
</style>
