<template>
  <div id="edit" class="viewBox">
    <Button @click="backHome" icon="pi pi-arrow-left" class="p-button-rounded p-button-raised backHomeIcon"/>
    <form-wizard
      class="stepper"
      color="#5A7AB5"
      nextButtonText="下一步"
      backButtonText="上一步"
      finishButtonText="送出"
    >
      <tab-content title="基本配置" :beforeChange="()=>validateStep('basicsetting')">
        <BasicSetting ref="basicsetting" />
      </tab-content>
      <!-- <tab-content title="流程配置" :before-change="()=>validateStep('stepsetting')"> -->
      <tab-content title="流程配置">
        <StepSetting ref="stepsetting" />
      </tab-content>
      <!-- <tab-content title="聲音配置" :before-change="()=>validateStep('voicesetting')"> -->
      <tab-content title="聲音配置">
        <VoiceSetting ref="voicesetting"/>
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

import BasicSetting from './BasicSetting'
import StepSetting from './StepSetting'
import VoiceSetting from './VoiceSetting'

export default {
  components: {
    FormWizard,
    TabContent,
    BasicSetting,
    StepSetting,
    VoiceSetting
  },
  methods: {
    backHome () {
      this.$router.push('/makegame')
    },
    validateStep (name) {
      var refToValidate = this.$refs[name]
      return refToValidate.validate()
    }
  }
}
</script>

<style lang="scss">
#edit {
  position: relative;

  .backHomeIcon{
    position: absolute;
  }

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

  .wizard-navigation {
    margin-bottom: 3rem;
  }
}
</style>
