<template>
  <div id="makegame" class="viewBox">
    <Title>
      <template #text> 自製遊戲 </template>
    </Title>
    <form-wizard :title="false">
      <tab-content title="基本配置"> My first tab content </tab-content>
      <tab-content title="進程配置"> My second tab content </tab-content>
      <tab-content title="最後檢查">
        Yuhuuu! This seems pretty damn simple
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  components: {
    FormWizard,
    TabContent
  }
}
</script>

<style lang="scss">
#makegame {
  /* 修正套件樣式 */
  .vue-form-wizard .wizard-icon-circle .wizard-icon-container {
    border-radius: 50px;
    margin: -3px;
  }
  .wizard-header {
    display: none;
  }
}
</style>
