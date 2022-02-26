<template>
  <div id="popularGame">
    <h1 style="text-align: center">熱門遊戲🔥</h1>
    <div class="example-3d">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide v-for="game in popGames" :key="game._id">
          <img v-if="game.image" :src="game.image" @click="showDialog(game._id)" style="cursor: pointer;">
          <img v-else src="@/assets/images/image-placeholder.png" @click="showDialog(game._id)" style="cursor: pointer;"/>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>

    <div class="mt-3 mb-3" style="text-align: center">
      <Button
        label="查看更多"
        @click="seeMore"
        class="start_btn p-button-rounded p-button-raised p-button-lg"
        style="font-weight: 900;"
      />
    </div>

    <Dialog :visible.sync="dialogDisplay" @hide="stepIndex = ''" position="center" :showHeader="false" modal dismissableMask>
      <div style="max-height: 70vh; max-width: 800px">
        <img v-if="image" :src="image">
        <img v-else src="@/assets/images/image-placeholder.png"/>
        <div class="dialogText mb-5">
          <h1>{{ name }}</h1>
          <h4>遊玩人數: {{ playerRange[0] }} ~ {{ playerRange[1] }}</h4>
          <p style="max-width: 800px; padding: 0 2rem">{{ description }}</p>
          <div class="goodCamp" style="display: inline-block">好人陣營</div>
          <p>
            <span v-for="(role, index) in goodCampRoleList" :key="role.id">{{ role.name }}<span v-if="index !== goodCampRoleList.length - 1"> / </span></span>
          </p>
          <div class="badCamp" style="display: inline-block">壞人陣營</div>
          <p>
            <span v-for="(role, index) in badCampRoleList" :key="role.id">{{ role.name }}<span v-if="index !== badCampRoleList.length - 1"> / </span></span>
          </p>
          <div v-if="enableFunRole" class="funRole" style="display: inline-block">功能身分</div>
          <p v-if="enableFunRole">
            <span v-for="(role, index) in funRoleList" :key="role.id">{{ role.name }}<span v-if="index !== funRoleList.length - 1"> / </span></span>
          </p>
        </div>
        <div class="dialogStep pb-5">
          <h1 class="mb-3">遊戲流程</h1>
          <VueSelect
            v-model="stepIndex"
            :options="stepListDisplayHelper"
            :reduce="s => stepListDisplayHelper.findIndex(step => step.id === s.id)"
            label="name" placeholder="選擇流程" class="VueSelectWidth mx-auto mb-4"
          />
          <h2 v-if="stepListDisplayHelper[stepIndex]" class="stepHeader">{{ stepListDisplayHelper[stepIndex].name }}</h2>
          <StepList v-if="stepListDisplayHelper[stepIndex]" :data="stepListDisplayHelper[stepIndex].rules"/>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import StepList from '@/components/StepList.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PopularGame',
  components: {
    Swiper,
    SwiperSlide,
    StepList
  },
  data () {
    return {
      swiperOption: {
        effect: 'coverflow',
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        autoplay: {
          delay: 2500
        }
      },
      popGames: [],
      dialogDisplay: false,
      stepIndex: ''
    }
  },
  methods: {
    showDialog (gameId) {
      this.$store.dispatch('game/getOneGame', gameId)
      this.dialogDisplay = !this.dialogDisplay
    },
    seeMore () {
      this.$router.push('/populargame')
    }
  },
  computed: {
    ...mapState('game', ['name', 'description', 'image', 'playerRange', 'goodCampRoleList', 'badCampRoleList', 'enableFunRole', 'funRoleList', 'stepList']),
    ...mapGetters('game', ['stepListDisplayHelper'])
  },
  async created () {
    try {
      const { data } = await this.serverAPI.get('/games', {
        params: {
          page: this.page
        }
      })
      this.popGames = data.result
    } catch (error) {
      this.$swal({
        icon: 'success',
        title: '錯誤',
        text: '取得失敗'
      })
    }
  }
}
</script>

<style lang="scss">
  #popularGame{
    background-color: #fff;
    padding: 1rem 3rem;

    .p-dialog {
      border-radius: 10px;
      overflow: hidden;

      .p-dialog-content {
        padding-left: 0;
        padding-right: 0;
        text-align: center;
      }

      img {
        max-height: 75vh;
        object-fit: contain;
      }
    }

    .stepHeader {
      width: max-content;
      margin: 1rem auto;
      padding: 5px 10px;
      border-radius: 9999px;
      background-color: #ffc107;
    }

    .goodCamp,
    .badCamp,
    .funRole {
      border-radius: 9999px;
      padding: 5px 10px;
    }

    .goodCamp {
      background-color: #a1dcff;
    }

    .badCamp {
      background-color: #ffc4c8;
    }

    .funRole {
      background-color: #FDD31C;
    }
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
