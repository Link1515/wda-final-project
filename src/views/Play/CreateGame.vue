<template>
  <div id="createGame" >
    <Title>
      <template #text>
        創建遊戲
      </template>
    </Title>
    <div class="subViewBox">
      <div class="mx-auto" style="width: max-content">
        <div class="d-flex flex-column flex-md-row align-items-center mb-2">
          <span class="mb-2 mb-md-0">您的暱稱</span>
          <InputText v-model="playerName" class="ms-md-3 flex-grow-1"/>
        </div>
        <div class="invalidMsg mb-3" v-if="!$v.playerName.required && $v.playerName.$error" style="text-align: center">暱稱必填</div>
        <div class="d-flex flex-column flex-md-row align-items-center mb-3">
          <div class="flex-shrink-0 mb-2 mb-md-0">選擇遊戲</div>
          <VueSelect v-model="selectedGame" :options="$store.state.user.favoriteGame" :reduce="f => f.game" label="name" placeholder="---選擇遊戲---" class="flex-grow-1 ms-md-3" style="width: 100%"/>
        </div>
        <div v-if="$store.state.game._id" class="d-flex align-items-center mb-3">
          <span>遊玩人數 {{ playerAmount }}</span>
          <Slider
            v-model="playerAmount"
            :step="1"
            :min="$store.state.game.playerRange[0]"
            :max="$store.state.game.playerRange[1]"
            class="ms-3 flex-grow-1"
          />
        </div>
      </div>
      <div v-if="$store.state.game._id" class="col-12 col-md-8 mx-auto" style="text-align: center">
        <div class="mx-auto" style="max-width: 600px">
          <img v-if="$store.state.game.image" :src="$store.state.game.image">
          <img v-else src="@/assets/images/image-placeholder.png">
        </div>
        <Button @click="createRoom" label="創建" class="p-button-rounded p-button-raised mt-3"/>
      </div>
    </div>
    <Toast position="top-center" />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import Slider from 'primevue/slider'

export default {
  name: 'CreateGame',
  components: {
    Slider
  },
  data () {
    return {
      playerName: '',
      selectedGame: '',
      playerAmount: 0
    }
  },
  validations: {
    playerName: {
      required
    }
  },
  methods: {
    createRoom () {
      this.$v.$touch()
      if (this.$v.$error) {
        this.$toast.add({ severity: 'error', summary: '錯誤', detail: '缺少必要項目', life: 3000 })
        return
      }

      if (this.$socket.connected) {
        this.$socket.emit('createRoom',
          {
            playerId: this.userInfo._id,
            playerName: this.playerName,
            playerAmount: this.playerAmount,
            gameId: this.selectedGame
          })
      }

      this.$router.push('/room')
    }
  },
  watch: {
    selectedGame (value) {
      if (value) {
        this.$store.dispatch('game/getOneGame', this.selectedGame)
        this.playerAmount = this.$store.state.game.playerRange[0]
      }
    }
  },
  created () {
    this.$store.commit('game/reset')
    this.playerName = this.userInfo.account
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$socket.connected) {
        next('/room')
      } else {
        vm.$socket.connect()
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/room') {
      this.$socket.disconnect()
    }
    next()
  }
}
</script>
