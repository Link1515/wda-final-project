<template>
  <div id="joinGame" >
    <Title>
      <template #text>
        加入遊戲
      </template>
    </Title>
    <div class="subViewBox">
      <div class="mx-auto" style="width: max-content; text-align: center">
        <div class="d-flex flex-column flex-md-row align-items-center mb-2">
          <span class="mb-2 mb-md-0">您的暱稱</span>
          <InputText v-model="playerName" class="ms-3 flex-grow-1"/>
        </div>
        <div class="invalidMsg mb-3" v-if="!$v.playerName.required && $v.playerName.$error">暱稱必填</div>
        <div class="d-flex flex-column flex-md-row align-items-center mb-2">
          <span class="mb-2 mb-md-0">遊戲間 ID</span>
          <InputText v-model="roomId" class="ms-3 flex-grow-1" maxlength="6"/>
        </div>
        <div class="invalidMsg mb-3" v-if="!$v.roomId.required && $v.roomId.$error">遊戲間 ID 必填</div>
        <div class="invalidMsg mb-3" v-if="!$v.roomId.minLength && $v.roomId.$error">遊戲間 ID 長度為 {{$v.roomId.$params.minLength.min}}</div>
        <Button @click="joinRoom" label="加入" class="p-button-rounded p-button-raised mt-3"/>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'CreateGame',
  data () {
    return {
      playerName: '',
      roomId: ''
    }
  },
  validations: {
    playerName: {
      required
    },
    roomId: {
      required,
      minLength: minLength(6)
    }
  },
  methods: {
    joinRoom () {
      this.$v.$touch()
      if (this.$v.$error) return

      this.$socket.connect()
      this.$socket.emit('joinRoom', this.roomId)
    }
  },
  sockets: {
    error (msg) {
      console.log(msg)
    }
  },
  watch: {
    selectedGame () {
      this.$store.dispatch('game/getOneGame', this.selectedGame.game)
      this.playerAmount = this.$store.state.game.playerRange[0]
    }
  },
  created () {
    this.$store.commit('game/reset')
    this.playerName = this.userInfo.account
  }
}
</script>

<style lang="scss">
</style>
