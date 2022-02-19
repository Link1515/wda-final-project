<template>
  <div id="app">
    <ScrollPanel style="height: 100vh">
      <div class="container">
        <Navbar />
        <keep-alive include="Room">
          <router-view />
        </keep-alive>
      </div>
      <Footer/>
    </ScrollPanel>
  </div>
</template>

<script>
import Navbar from './components/App/Navbar.vue'
import Footer from './components/App/Footer.vue'
import ScrollPanel from 'primevue/scrollpanel'

export default {
  components: {
    Footer,
    Navbar,
    ScrollPanel
  },
  created () {
    this.$store.dispatch('user/getInfo')
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

body {
  background-color: var(--color-bg);
  font-family: 'Open Sans', sans-serif;
}

body::-webkit-scrollbar {
  display: none;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: top;
}

ul {
  padding: 0;
}

li {
  list-style: none;
}

.routerviewHeight {
  min-height: calc(100vh - 82px)
}

.viewBox{
  overflow: hidden;
  background-color: var(--color-info);
  border-radius: 0 0 8px 8px;
}

.subViewBox {
  background-color: #fff;
  border-radius: 8px;
  padding: 3rem 0;
}

.borderBox {
  border-radius: 8px;
  border: 2px solid #000;
  padding: 2rem;
}

.VueSelectWidth {
  width: 215px;
}

.position-relative{
  position: relative;
}

.invalidMsg {
  color: red;
}

#app {
  .container {
    margin-top: 2rem !important;
    margin-bottom: 2rem !important;
  }

  .p-scrollpanel-bar {
    background-color: var(--color-primary);
  }

  .p-card {
    text-align: center;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 5px 5px 10px #74b2d1;
    height: 100%;
    transition: box-shadow .5s;

    img {
      cursor: pointer;
      transition: transform .5s;
    }

    .p-card-header {
    overflow: hidden;
    img {
      height: 200px;
    }
  }
  }

  .p-card:hover {
    box-shadow: 10px 10px 15px #74b2d1;
    img {
      transform: scale(1.2);
    }
  }

  .p-button:focus{
    box-shadow: none;
  }

  .p-inputtext {
    padding-left: 1rem;
    padding-right: 1rem;
    border-radius: 9999px;
  }
}
</style>
