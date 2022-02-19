<template>
  <div id="ManageUser">
    <div class="d-flex flex-column justify-content-center align-items-center mb-3">
      <h1>會員管理</h1>
      <div class="d-flex flex-column flex-md-row align-items-center mb-2">
        <InputText type="password" v-model="oldPassword" @keydown.enter="updateAndSave" class="me-md-2 flex-grow-1 mb-2 mb-md-0"/>
        <VueSelect
          v-model="searchType"
          :options="searchTypeList"
          :reduce="option => option.type"
          label="name" class="VueSelectWidth"
          placeholder="選擇搜尋類型"
        />
        <Button icon="pi pi-search" class="p-button-rounded p-button-raised" />
      </div>
    </div>
    <!-- <DataTable stripedRows :value="searchResult" class="mb-5">
      <Column field="role" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          <FontAwesomeIcon v-if="slotProps.data.role === 1" :icon="['fas','crown']" style="color: #fa0"></FontAwesomeIcon>
        </template>
      </Column>
    </DataTable> -->
  </div>
</template>

<script>
export default {
  name: 'ManageUser',
  data () {
    return {
      searchTypeList: [
        { name: '玩家帳號', type: 'account' },
        { name: '玩家ID', type: '_id' }
      ],
      searchType: '',
      searchResult: []
    }
  }
}
</script>

<style>

</style>
