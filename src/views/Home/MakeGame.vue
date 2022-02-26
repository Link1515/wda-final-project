<template>
  <div id="MakeGame">
    <h1 style="text-align: center">找不到喜歡的遊戲?</h1>
    <div class="row g-4">
      <div class="col-12">
        <Card style="max-width: 600px; margin: auto">
          <template #content>
            <p style="line-height: 25px; font-size: 1rem; font-weight: 600">
              易桌遊提供玩家自製桌遊，可以自訂流程，做出屬於自己的桌遊!
            </p>
          </template>
        </Card>
      </div>
      <div class="col-12">
        <div class="banner_img">
          <img src="@/assets/images/design.jpg" class="d-block" style="max-width: 600px; margin: auto">
        </div>
      </div>
    </div>

    <div class="mt-5 mb-3" style="text-align: center">
      <Button
        label="立即製作"
        @click="goMake"
        class="start_btn p-button-rounded p-button-raised p-button-lg"
        style="font-weight: 900;"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MakeGame',
  methods: {
    goMake () {
      this.$router.push('/makegame')
    }
  }
}
</script>

<style>
#MakeGame {
  border-radius: 0 0 8px 8px;
  background-color: var(--color-info);
  padding: 1rem 3rem;
}
</style>
