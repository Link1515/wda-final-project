<template>
  <div id="play" class="viewBox">
    <Title>
      <template #text>
        立即開始！
      </template>
    </Title>
    <div class="row g-5 justify-content-evenly">
      <div class="col-8 col-lg-4">
        <Card>
          <template #header>
            <FontAwesomeIcon :icon="['fas','gamepad']" size="10x"></FontAwesomeIcon>
          </template>
          <template #footer>
            <div class="play_texticon py-2">
              創建遊戲
            </div>
          </template>
        </Card>
      </div>
      <div class="col-8 col-lg-4">
        <Card>
          <template #header>
            <FontAwesomeIcon :icon="['fas','running']" size="10x" transform="filp-h"></FontAwesomeIcon>
          </template>
          <template #footer>
            <div class="play_texticon py-2">
              加入遊戲
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'play'
}
</script>

<style lang="scss">
#play {
  .p-card {
    margin: auto;
    text-align: center;
    overflow: hidden;
  }

  .p-card-header {
    padding: 3rem 0;
    display: grid;
    place-items: center;
  }

  .p-card-body {
    padding: 0;
  }

  .p-card-content {
    display: none;
  }

  .play_texticon {
    background-color: var(--color-bg);
    color: #fff;
    font-weight: 600;
    font-size: 2rem;
    letter-spacing: 1rem;
  }

  @media (min-width: 1200px) {
    .p-card-header {
      padding: 5rem 0;
  }
  }
}
</style>
