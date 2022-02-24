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
      <span v-if="slotProps.data.mode === '計時'">
        <Avatar :icon="slotProps.data.iconType" shape="circle" class="me-2 mb-3" :style="{ background: slotProps.data.iconColor, color: '#000' }"/>
        {{ slotProps.data.mode }}
        <br>
        {{ slotProps.data.data }} 秒
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
      <span v-if="slotProps.data.mode === '多選一'">
        <Avatar :icon="slotProps.data.iconType" shape="circle" class="me-2 mb-3" :style="{ background: slotProps.data.iconColor, color: '#000' }"/>
        {{ slotProps.data.mode }}
        <br>
        執行角色: {{ slotProps.data.conductingRoleListName }} {{ slotProps.data.conductingRoleName }}
        <br>
        <br>
        此步驟後
        <div v-for="(option, index) in slotProps.data.data.optionsData" :key="index" class="mt-1">
          <span>選項{{ option.inc }}: {{ option.name }}</span>
        </div>
        <br>
        時間: {{ slotProps.data.data.timer }} 秒
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
