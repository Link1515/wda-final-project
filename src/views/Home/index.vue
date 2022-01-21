<template>
  <div id="home">
    <Banner />
    <PopuplarGame/>
  </div>
</template>

<script>
import Banner from './Banner.vue'
import PopuplarGame from './PopularGame.vue'

export default {
  name: 'Home',
  components: {
    Banner,
    PopuplarGame
  }
}
</script>

<style>

</style>
