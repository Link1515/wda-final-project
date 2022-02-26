<template>
  <div id="home" class="routerviewHeight">
    <Banner />
    <PopuplarGame/>
    <MakeGame/>
  </div>
</template>

<script>
import Banner from './Banner.vue'
import PopuplarGame from './PopularGame.vue'
import MakeGame from './MakeGame.vue'

export default {
  name: 'Home',
  components: {
    Banner,
    PopuplarGame,
    MakeGame
  }
}
</script>

<style>

</style>
