<template>
  <div id="room" class="viewBox">
    <Title>
      <template #text>
        等待玩家加入中 ... {{ joinedPlayerAmount }} / {{ playerAmount }}
      </template>
    </Title>
    <div class="subViewBox">
      <h2 style="margin: 0; text-align: center;">
        遊戲間 ID: <span class="roomId">{{ roomId }}<i @click="copyRoomId" class="pi pi-copy ms-3"></i></span>
        <input type="hidden" ref="roomIdInput" :value="roomId">
      </h2>
      <DataTable>
        <Column />
      </DataTable>
    </div>
    <Toast position="top-center"/>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { mapState } from 'vuex'

export default {
  name: 'Room',
  components: {
    DataTable,
    Column
  },
  methods: {
    copyRoomId () {
      const roomIdInput = this.$refs.roomIdInput
      roomIdInput.setAttribute('type', 'text')
      roomIdInput.select()
      document.execCommand('copy')

      this.$toast.add({ severity: 'success', summary: '成功', detail: '成功複製遊戲間 ID', life: 3000 })
      roomIdInput.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    }
  },
  computed: {
    ...mapState('room', ['roomId', 'playerAmount', 'joinedPlayerAmount', 'playerList'])
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$socket.connected) {
        next('/play')
      }
    })
  }
}
</script>

<style lang="scss">
  #room {
    padding: 0 4rem 6rem;

    .roomId {
      display: inline-block;
      padding: 0.5rem 1rem;
      background-color: var(--color-info);
      border-radius: 9999px;

      i {
        cursor: pointer;
        font-size: 1.4rem;
        transition: transform .3s;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
</style>
