<template>
  <div id="populargame" class="viewBox">
    <Title>
      <template #text>
        熱門遊戲
      </template>
    </Title>
    <div class="row g-5">
      <div class="col-12 col-md-6 col-lg-4 col-xl-3" v-for="i in 10" :key="i">
        <Card>
          <template #header>
            <img @click="showModel" src="https://andyventure.com/wp-content/uploads/boardgame_salem_1692.webp">
          </template>
          <template #title>
            獵巫鎮
          </template>
          <template #content>
            <Rating v-model="val" :readonly="true" :cancel="false"/>
          </template>
          <template #footer>
            <ToggleButton v-model="liked" onIcon="pi pi-heart-fill" offIcon="pi pi-heart"/>
          </template>
        </Card>
      </div>
    </div>
    <Dialog :visible.sync="modelDisplay" position="left" :showHeader="false" modal dismissableMask>
      <img @click="showModel" src="https://andyventure.com/wp-content/uploads/boardgame_salem_1692.webp" style="width: 300px">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga totam, beatae ipsa maiores possimus quo impedit eos tempora laboriosam minus natus quisquam, amet aut ducimus. Iure vel perspiciatis quod eligendi labore cupiditate aliquam. Maxime ipsa eius quo hic explicabo? Dolore eaque laborum doloremque vel rerum eum molestiae, error, eligendi expedita illo minus esse, quam cumque maiores a omnis voluptatum enim est? Id, eaque atque dolorum incidunt iste odit excepturi sint voluptate et veniam itaque nostrum quisquam autem soluta laborum vitae, dolor dignissimos enim quaerat laudantium, error perferendis laboriosam doloribus eum. Modi deserunt aliquid, quod nulla sunt quae, pariatur cupiditate dicta fuga explicabo ab. Pra</p>
    </Dialog>
  </div>
</template>

<script>
import Rating from 'primevue/rating'
import ToggleButton from 'primevue/togglebutton'
import Dialog from 'primevue/dialog'

export default {
  components: {
    Rating,
    ToggleButton,
    Dialog
  },
  data () {
    return {
      val: 3,
      liked: false,
      modelDisplay: false
    }
  },
  methods: {
    showModel () {
      this.modelDisplay = !this.modelDisplay
    }
  }
}
</script>

<style lang="scss">
#populargame {
  padding: 0 4rem 6rem;

  .p-card {
    text-align: center;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 5px 5px 10px rgba(143, 174, 189, 0.5);

    img {
      cursor: pointer;
    }
  }

  .p-card-content {
    padding: 0;
  }

  .p-button {
    border: none;
  }

  .p-button:focus {
    box-shadow: none;
  }

  .p-button:hover {
    background-color: transparent;
  }

  .p-button-icon {
    font-size: 2rem;
    color: #F06771;
  }

  .p-highlight {
    background-color: transparent;
  }

}
</style>
