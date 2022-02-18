<template>
  <div id="editPassword">
    <div class="d-flex flex-column justify-content-center align-items-center">
      <h1>修改密碼</h1>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">原密碼</span>
        <InputText type="password" v-model="oldPassword" class="ms-md-3 flex-grow-1"/>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">新密碼</span>
        <InputText type="password" v-model="newPassword" class="ms-md-3 flex-grow-1"/>
      </div>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <span class="mb-2 mb-md-0">再次輸入新密碼</span>
        <InputText type="password" v-model="newPasswordAgain" class="ms-md-3 flex-grow-1"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: ''
    }
  }
}
</script>

<style>

</style>
