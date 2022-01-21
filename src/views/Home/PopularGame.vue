<template>
  <div id="popularGame">
    <h1>熱門遊戲</h1>
    <div class="example-3d">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide>Slide 1</swiper-slide>
        <swiper-slide>Slide 2</swiper-slide>
        <swiper-slide>Slide 3</swiper-slide>
        <swiper-slide>Slide 4</swiper-slide>
        <swiper-slide>Slide 5</swiper-slide>
        <swiper-slide>Slide 6</swiper-slide>
        <swiper-slide>Slide 7</swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  name: 'PopularGame',
  components: {
    Swiper,
    SwiperSlide
  },
  data () {
    return {
      swiperOption: {
        loop: true,
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        pagination: {
          // el: '.swiper-pagination'
        }
      }
    }
  }
}
</script>

<style lang="scss">
  #popularGame{
    background-color: #fff;
    padding: 1rem 3rem;
  }

  .example-3d {
    width: 100%;
    height: 400px;
    padding-top: 50px;
    padding-bottom: 50px;
  }

  .swiper {
    height: 100%;
    width: 100%;

    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 300px;
      height: 300px;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      background-color: #2C8DFB;
      background-position: center;
      background-size: cover;
      color: #fff;
    }

    .swiper-pagination {
      .swiper-pagination-bullet.swiper-pagination-bullet-active {
        background-color: #fff;
      }
    }
  }
</style>
