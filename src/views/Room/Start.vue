<template>
  <div id="start" class="viewBox routerviewHeight">
    <div class="subViewBox">
      <TabView>
        <TabPanel header="在線玩家">
          <DataTable stripedRows :value="playerList">
            <Column field="role" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <FontAwesomeIcon v-if="slotProps.data.role === 1" :icon="['fas','crown']" style="color: #fa0"></FontAwesomeIcon>
              </template>
            </Column>
            <Column field="name" header="玩家頭像" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <Avatar v-if="slotProps.data.avatar" :image="slotProps.data.avatar" class="mr-2" size="large" shape="circle"/>
                <Avatar v-else icon="pi pi-user" class="mr-2" size="large" shape="circle"/>
              </template>
            </Column>
            <Column field="name" header="玩家暱稱" :bodyStyle="{ textAlign: 'center' }">
              <template #body="slotProps">
                <span :class="{ self: $socket.id === slotProps.data.socketId }">{{ slotProps.data.name }}</span>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
        <TabPanel header="遊戲流程">
          <DataTable stripedRows :value="gameInfo.stepList">
            <Column :bodyStyle="{ textAlign: 'center', justifyContent: 'center' }">
              <template #body="slotProps">
                <span v-if="slotProps.data.mode === '語音'">
                  {{ slotProps.data.data }}
                </span>
                <span v-else-if="slotProps.data.mode === '顯示'">
                  顯示 {{ translateRoleType(slotProps.data.data.roleListType) }} {{translateRoleName(slotProps.data.data.roleListType, slotProps.data.data.roleId)}}，時間 {{slotProps.data.data.timer}} 秒
                </span>
                <span v-else-if="slotProps.data.mode === '標記'">
                  {{ translateRoleType(slotProps.data.data.conductingRoleListType) }} {{translateRoleName(slotProps.data.data.conductingRoleListType, slotProps.data.data.conductingRoleId)}} 執行標記，時間 {{slotProps.data.data.timer}} 秒
                </span>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
        <TabPanel header="流程控制" v-if="playerData.role === 1">
          <div class="row g-3" style="text-align: center">
            <div class="col-12">
              <Button label="播放" @click="runStep" icon="pi pi-caret-right" class="p-button-rounded p-button-raised p-button-lg"/>
            </div>
            <div class="col-12">
              <Button label="重置" @click="resetStep" icon="pi pi-replay" class="p-button-rounded p-button-raised p-button-lg p-button-secondary"/>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Start',
  components: {
    DataTable,
    Column,
    Avatar,
    TabView,
    TabPanel
  },
  computed: {
    ...mapState('room', ['gameInfo', 'playerList']),
    ...mapGetters('room', ['playerData'])
  },
  methods: {
    runStep () {
      this.$socket.emit('runStep')
    },
    resetStep () {
      speechSynthesis.cancel()
      this.$socket.emit('resetStep')
    },
    translateRoleType (RoleType) {
      switch (RoleType) {
        case 'goodCampRoleList':
          return '好人陣營'
        case 'badCampRoleList':
          return '壞人陣營'
        case 'funRoleList':
          return '功能角色'
      }
    },
    translateRoleName (roleType, roleId) {
      if (this.gameInfo[roleType]) {
        for (const role of this.gameInfo[roleType]) {
          if (role.id === roleId) {
            return role.name
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
#start {
  padding: 4rem 0rem;

  .p-tabview-nav {
    justify-content: center;
  }

  .p-tabview-panels {
    padding: 0;
    padding-top: 2rem;
  }
}
</style>
