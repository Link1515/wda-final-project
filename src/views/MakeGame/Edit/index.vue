<template>
  <div id="edit" class="viewBox">
  <Button @click="backHome" icon="pi pi-arrow-left" class="p-button-rounded" />
  <form-wizard class="stepper" color="#5A7AB5">
    <tab-content title="基本配置"><BasicSetting></BasicSetting></tab-content>
    <tab-content title="進程配置"><StepSetting></StepSetting></tab-content>
    <tab-content title="最後檢查"><FinalCheck></FinalCheck></tab-content>
  </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import BasicSetting from './BasicSetting'
import StepSetting from './StepSetting'
import FinalCheck from './FinalCheck'

export default {
  components: {
    FormWizard,
    TabContent,
    BasicSetting,
    StepSetting,
    FinalCheck
  },
  methods: {
    backHome () {
      this.$router.push('/makegame')
    }
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
  .stepper{
    padding-top: 2rem;

    .wizard-nav {
      margin-bottom: 2rem;
    }
  }
}
</style>
