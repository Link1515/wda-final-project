<template>
  <div id="home">
    <Banner />
    <PopuplarGame/>
  </div>
</template>

<script>
import Banner from '../components/Home/Banner.vue'
import PopuplarGame from '../components/Home/PopularGame.vue'

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
