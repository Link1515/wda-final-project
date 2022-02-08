<template>
  <div id="createGame" >
    <Title>
      <template #text>
        創建遊戲
      </template>
    </Title>
    <div class="subViewBox">
      <div class="mx-auto" style="width: max-content">
        <div class="d-flex flex-column flex-md-row align-items-center mb-3">
          <span class="mb-2 mb-md-0">您的暱稱</span>
          <InputText v-model="playerName" class="ms-3 flex-grow-1"/>
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center mb-3">
          <div class="flex-shrink-0 mb-2 mb-md-0">選擇遊戲</div>
          <VSelect v-model="selectedGame" :options="$store.state.user.favoriteGame" placeholder="選擇遊戲" textProp="name" class="ms-3"/>
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
        <img v-if="$store.state.game.image" :src="$store.state.game.image">
        <img v-else src="@/assets/images/image-placeholder.png">
        <Button label="創建" class="p-button-rounded p-button-raised mt-3"/>
      </div>
    </div>
  </div>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import Slider from 'primevue/slider'

export default {
  name: 'CreateGame',
  components: {
    VSelect,
    Slider
  },
  data () {
    return {
      playerName: '',
      selectedGame: '---收藏遊戲---',
      playerAmount: 0
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
