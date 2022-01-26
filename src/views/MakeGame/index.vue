<template>
  <div id="makegame" class="viewBox">
    <Title>
      <template #text>自製遊戲</template>
    </Title>
    <div class="row g-5" v-show="showMakegameHome">
        <div class="col-12 col-md-6 col-lg-4 col-xl-3" v-for="i in 1" :key="i">
          <Card>
            <template #header>
              <img src="https://andyventure.com/wp-content/uploads/boardgame_salem_1692.webp">
            </template>
            <template #title>
              獵巫鎮
            </template>
          </Card>
        </div>
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
          <div class="addNewGame" @click="addNewGame">
            <i class="pi pi-plus"></i>
          </div>
        </div>
      </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  computed: {
    showMakegameHome () {
      return this.$route.path === '/makegame'
    }
  },
  methods: {
    addNewGame () {
      this.$router.push('/makegame/edit')
    }
  }
}
</script>

<style lang="scss">
#makegame {
  padding: 0 0.5rem 6rem;

  .p-card-content {
    padding: 0;
  }

  .addNewGame {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 2rem 0;
    border: 5px dashed #000;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    i{
      font-size: 3rem;
    }
  }
}

@media (min-width: 992px) {
  #makegame{
    padding: 0 4rem 6rem;
  }
}
</style>
