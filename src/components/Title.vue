<template>
  <div id="title">
    <h1>
      <span><slot name="text"></slot></span>
    </h1>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  letter-spacing: 0.5rem;
  font-size: 2.5rem;
  margin-bottom: 4rem;

  span {
    position: relative;
    z-index: 2;
    &::after {
      content: '';
      width: 120px;
      height: 5px;
      background-color: var(--color-primary);
      position: absolute;
      bottom: 0px;
      left: -10px;
    }
  }
}
</style>
