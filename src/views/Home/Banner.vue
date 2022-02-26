<template>
  <div id="banner">
    <h1>讓下一場<span>桌遊</span>更容<span>易</span></h1>
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <div class="banner_img">
          <img src="@/assets/images/banner.jpg">
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <Card>
          <template #content>
            <p style="line-height: 25px">易桌遊是一個專為<b>陣營類桌遊</b>設計的輔助網站，能夠代替玩家主持桌遊，推動桌遊的進行。有以下特點</p>
            <ul>
              <li>電腦語音</li>
              <li>輔助顯示玩家</li>
              <li>輔助標記玩家</li>
              <li>結果紀錄</li>
            </ul>
          </template>
        </Card>
      </div>
    </div>
    <div class="mt-5 mb-3 banner_buttonBox">
      <Button
        @click="startGame"
        :label="$socket.connected ? '返回遊戲' : '立即開始！'"
        class="start_btn p-button-rounded p-button-raised p-button-lg"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  methods: {
    startGame () {
      if (this.$socket.connected) {
        this.$router.push('/room')
      } else {
        this.$router.push('/play')
      }
    }
  }

}
</script>

<style scoped lang="scss">
  #banner{
    background-color: var(--color-info);
    padding: 1rem 3rem;

    h1 {
      span {
        margin: 0 0.25rem;
        padding: 0 0.5rem;
        padding-right: 0.65rem;
        background-color: var(--color-primary);
        border-radius: 9999px;
      }
    }

    .banner_buttonBox{
      text-align: center;
    }

    .banner_img {
      overflow: hidden;
    }

    .start_btn {
      font-weight: 900;
    }

    .p-card-body {
      ul {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      li{
        margin: 6px 0;
        padding: 6px 12px;
        border-radius: 9999px;
        color: #000;
        font-weight: 500;
        background-color: #ffc107;
      }
    }
  }
</style>
