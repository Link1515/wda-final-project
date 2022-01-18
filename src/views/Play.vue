<template>
  <div id="play">
    <Title>
      <template #text>
        立即開始！
      </template>
    </Title>
    <div class="row">
      <div class="col-6">
        <!-- <Card>
          <template #header>

          </template>
        </Card> -->
      </div>
      <div class="col-6">
        <VueFontawesome icon="bath" size="2" color="lightgray"></VueFontawesome>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  #play {
    overflow: hidden;
    background-color: var(--color-info);
  }
</style>
