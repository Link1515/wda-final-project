<template>
  <div id="createGame" class="viewBox">
    <Title>
      <template #text>
        創建遊戲
      </template>
    </Title>
    <div class="subViewBox">
      <div class="mx-auto" style="width: max-content">
        <div class="d-flex align-items-center mb-3"><span>您的暱稱:</span><InputText class="ms-3 flex-grow-1"/></div>
        <div class="d-flex align-items-center mb-3"><span>選擇遊戲:</span><Dropdown v-model="selectedGame" :options="userInfo.favoriteGame" optionLabel="name" optionValue="game" class="ms-3 flex-grow-1"/></div>
        <div class="d-flex align-items-center mb-3"><span>遊玩人數:</span><Slider v-model="playerAmount" class="ms-3 flex-grow-1"/></div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import Slider from 'primevue/slider'

export default {
  name: 'CreateGame',
  components: {
    Dropdown,
    Slider
  },
  data () {
    return {
      selectedGame: '',
      playerAmount: 0
    }
  }
}
</script>

<style lang="scss">
#createGame {
  padding: 0 4rem 6rem;
}
</style>
