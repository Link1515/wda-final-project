<template>
  <div id="basicsetting">
    <div class="row justify-content-center g-3 subViewBox">
      <div class="col-9 col-xl-4 d-flex justify-content-center align-items-center flex-wrap flex-lg-nowrap">
        <label for="gameName" class="me-md-3 my-2">遊戲名稱: </label>
        <InputText id="gameName"></InputText>
      </div>
      <div class="col-9 col-xl-4 d-grid">
        <div class="d-flex flex-column align-items-xl-center flex-xl-row">
          <label class="me-3 mb-3 mb-xl-0">遊玩人數: <span class="playerNum">{{ playerRange[0] }}</span> ~ <span class="playerNum">{{ playerRange[1] }}</span> 人</label>
          <Slider class="flex-grow-1" v-model="playerRange" :range="true" :max="20" :min="2"></Slider>
        </div>
      </div>
      <!--
        設定陣營身分
      -->
      <div class="col-12 col-md-9 borderBox">
        <div class="mb-4">
          <label for="compIdentity" class="me-md-3 my-2">陣營身分: </label>
          <InputText
            @keydown.enter="setGoodComp"
            @keydown.ctrl="setBadComp"
            id="compIdentity"
            v-model="compIdentity"
            class="mb-2 mb-lg-0"
          ></InputText>
          <Button
            @click="setGoodComp"
            class="p-button-rounded ms-2 setBtn goodColor"
            v-tooltip.top="'Enter 鍵快速加入'"
          >設為好人</Button>
          <Button
            @click="setBadComp"
            class="p-button-rounded ms-2 setBtn badColor"
            v-tooltip.top="'Ctrl 鍵快速加入'"
          >設為壞人</Button>
          <hr class="my-4 mx-5">
        </div>
        <div class="goodComp mb-2">
          <component :is="'Chip'" v-for="item in goodCompList" :key="item.id" :label="item.text" class="goodColor me-2 mb-2" removable style="font-weight: bold"></component>
        </div>
        <div class="badComp mb-2">
          <component :is="'Chip'" v-for="item in badCompList" :key="item.id" :label="item.text" class="badColor me-2" removable style="font-weight: bold"></component>
        </div>
      </div>
      <!--
        設定功能身分
      -->
      <div class="col-12 col-md-9 borderBox position-relative" :class="{disabled: !enableFunIdentity}">
        <div class="mb-4">
          <Checkbox class="funIdentityCheckbox" v-model="enableFunIdentity" binary/>
          <label for="funIdentity" class="me-md-3 my-2">功能身分: </label>
          <InputText
            id="funIdentity"
            v-model="funIdentity"
            class="mb-2 mb-lg-0"
          ></InputText>
          <Button
            @click="setfunRole"
            class="p-button-rounded ms-2 setBtn"
            v-tooltip.top="'Enter 鍵快速加入'"
          >設定</Button>
          <hr class="my-4 mx-5">
        </div>
        <div class="funRole mb-2">
          <component :is="'Chip'" v-for="item in funRoleList" :key="item.id" :label="item.text" class="me-2 mb-2" removable style="font-weight: bold"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider'
import Chip from 'primevue/chip'

export default {
  components: {
    InputText,
    Slider,
    Chip,
    Checkbox
  },
  data () {
    return {
      playerRange: [3, 8],
      compIdentity: '',
      goodCompList: [],
      badCompList: [],
      enableFunIdentity: false,
      funIdentity: '',
      funRoleList: []
    }
  },
  methods: {
    setGoodComp () {
      if (!this.compIdentity) return
      this.goodCompList.push({
        id: Date.now(),
        text: this.compIdentity
      })
      this.compIdentity = ''
    },
    setBadComp () {
      if (!this.compIdentity) return
      this.badCompList.push({
        id: Date.now(),
        text: this.compIdentity
      })
      this.compIdentity = ''
    },
    setfunRole () {
      if (!this.funIdentity) return
      this.funRoleList.push({
        id: Date.now(),
        text: this.funIdentity
      })
      this.funIdentity = ''
    }
  }
}
</script>

<style lang="scss">
#basicsetting {
  text-align: center;

  .playerNum {
    padding: 0 10px;
    background-color: #FDD31C;
    border-radius: 9999px;
  }

  .setBtn {
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    border: none;
  }

  .goodColor{
    background-color: #a1dcff;
  }

  .badColor{
    background-color: #ffc4c8;
  }

  .funIdentityCheckbox {
    position: absolute;
    left: 5px;
    top: 5px;
  }

  .disabled {
    filter: grayscale(1);
    background-color: #eee;
    input {
      background-color: #eee;
    }

    .funIdentityCheckbox::after {
      content: '勾選以啟用 "功能身分"';
      width: max-content;
      position: absolute;
      left: 150%;
    }
  }
}
</style>
