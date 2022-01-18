<template>
  <div id="app">
    <div class="container">
      <Navbar />
      <router-view></router-view>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Navbar from './components/App/Navbar.vue'
import Footer from './components/App/Footer.vue'

export default {
  components: {
    Footer,
    Navbar
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

body {
  background-color: var(--color-bg);
  font-family: 'Open Sans', sans-serif;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: top;
}

#app .container {
  overflow: hidden;
  border-radius: 12px;
  padding: 0;
  margin-top: 2rem !important;
  margin-bottom: 2rem !important;
}
</style>
