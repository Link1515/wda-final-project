<template>
  <ul id="steplist">
    <li v-for="step in List.rules" :key="step.id">
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
  name: 'StepList',
  props: ['List']
}
</script>

<style lang="scss">
#steplist {
  text-align: center;
  border-radius: 10px;
  padding: 1rem 5rem;
  background-color: #fff;

  li + li {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 3px dotted #666;
  }
}
</style>
