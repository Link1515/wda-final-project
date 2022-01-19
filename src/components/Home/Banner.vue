<template>
  <div class="banner">
    <h1>讓下一場<span>桌遊</span>更容<span>易</span></h1>
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <div class="banner_img rounded shadow">
          <img class="banner_img" src="https://web.ntnu.edu.tw/~40147014S/TG.jpg">
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <Card>
          <template #title>
            Simple Card
          </template>
          <template #content>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
            quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
          </template>
        </Card>
      </div>
    </div>
    <div class="text-center mt-5 mb-3">
      <Button label="立即開始！" class="start_btn p-button-rounded p-button-raised p-button-lg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner'
}
</script>

<style scoped lang="scss">
  h1 {
    span {
      margin: 0 0.25rem;
      padding: 0 0.5rem;
      padding-right: 0.65rem;
      background-color: var(--color-primary);
      border-radius: 9999px;
    }
  }

  .banner{
    background-color: var(--color-info);
    padding: 1rem 3rem;
  }

  .banner_img {
    overflow: hidden;
  }

  .start_btn {
    font-weight: 900;
  }
</style>
