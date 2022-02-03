<template>
  <ul id="steplist">
    <li v-for="step in $store.getters['game/stepListDisplayHelper']" :key="step.id">
      <template v-if="step.mode === '語音'">
        {{ step.data }}
      </template>
      <template v-if="step.mode === '顯示'">
        顯示角色: {{ step.roleListName }} {{ step.roleName }}
        <br>
        時間: {{ step.data.timer }} 秒
      </template>
      <template v-if="step.mode === '標記'">
        執行角色: {{ step.conductingRoleListName }} {{ step.conductingRoleName }}
        <br>
        標記: {{ step.data.label }}
        <br>
        時間: {{ step.data.timer }} 秒
      </template>
    </li>
  </ul>
</template>

<script>
export default {

}
</script>

<style lang="scss">
#steplist {
  li + li {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 3px dotted #666;
  }
}
</style>
