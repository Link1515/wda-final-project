<template>
  <div id="joinGame" >
    <Title>
      <template #text>
        加入遊戲
      </template>
    </Title>
    <div class="subViewBox">
      <div class="mx-auto" style="width: max-content; text-align: center">
        <div class="d-flex flex-column flex-md-row align-items-center mb-3">
          <span class="mb-2 mb-md-0">您的暱稱</span>
          <InputText v-model="playerName" class="ms-3 flex-grow-1"/>
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center mb-3">
          <span class="mb-2 mb-md-0">遊戲間 ID</span>
          <InputText v-model.number="roomId" class="ms-3 flex-grow-1"/>
        </div>
        <Button @click="joinRoom" label="加入" class="p-button-rounded p-button-raised mt-3"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CreateGame',
  data () {
    return {
      roomId: '',
      playerName: ''
    }
  },
  methods: {
    joinRoom () {
      this.$socket.connect()
      this.$socket.emit('joinRoom', this.roomId)
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
