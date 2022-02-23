<template>
<DataTable stripedRows :value="data">
  <Column :bodyStyle="{ textAlign: 'center', justifyContent: 'center' }">
    <template #body="slotProps">
      <span v-if="slotProps.data.mode === '語音'">
        <Avatar :icon="slotProps.data.iconType" shape="circle" class="me-2 mb-3" :style="{ background: slotProps.data.iconColor, color: '#000' }"/>
        {{ slotProps.data.mode }}
        <br>
        {{ slotProps.data.data }}
      </span>
      <span v-else-if="slotProps.data.mode === '顯示'">
        <Avatar :icon="slotProps.data.iconType" shape="circle" class="me-2 mb-3" :style="{ background: slotProps.data.iconColor, color: '#000' }"/>
        {{ slotProps.data.mode }}
        <br>
        <span class="d-inline-block mb-1">執行角色: {{ slotProps.data.conductingRoleListName }} {{ slotProps.data.conductingRoleName }}</span>
        <br>
        <span class="d-inline-block mb-1">顯示角色: {{ slotProps.data.roleListName }} {{ slotProps.data.roleName }}</span>
        <br>
        <span class="d-inline-block mb-1">時間: {{ slotProps.data.data.timer }} 秒</span>
      </span>
      <span v-else-if="slotProps.data.mode === '查驗'">
        <Avatar :icon="slotProps.data.iconType" shape="circle" class="me-2 mb-3" :style="{ background: slotProps.data.iconColor, color: '#000' }"/>
        {{ slotProps.data.mode }}
        <br>
        <span class="d-inline-block mb-1">執行角色: {{ slotProps.data.conductingRoleListName }} {{ slotProps.data.conductingRoleName }}</span>
        <br>
        <span class="d-inline-block mb-1">時間: {{ slotProps.data.data.timer }} 秒</span>
      </span>
      <span v-else-if="slotProps.data.mode === '標記'">
        <Avatar :icon="slotProps.data.iconType" shape="circle" class="me-2 mb-3" :style="{ background: slotProps.data.iconColor, color: '#000' }"/>
        {{ slotProps.data.mode }}
        <br>
        <span class="d-inline-block mb-1">執行角色: {{ slotProps.data.conductingRoleListName }} {{ slotProps.data.conductingRoleName }}</span>
        <br>
        <span class="d-inline-block mb-1">標記標籤: {{ slotProps.data.data.label }}</span>
        <br>
        <span class="d-inline-block mb-1">時間: {{ slotProps.data.data.timer }} 秒</span>
      </span>
    </template>
  </Column>
</DataTable>
</template>

<script>
export default {
  name: 'StepList',
  props: ['data']
}
</script>
