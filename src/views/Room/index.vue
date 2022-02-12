<template>
  <div id="room" class="viewBox">
    <Title>
      <template #text>
        等待玩家加入中 ... {{ joinedPlayerAmount }} / {{ playerAmount }}
      </template>
    </Title>
    <div class="subViewBox">
      <h2 style="margin: 0 auto 2rem; text-align: center;">
        遊戲間 ID: <span class="roomId">{{ roomId }}<i @click="copyRoomId" class="pi pi-copy ms-3"></i></span>
        <input type="hidden" ref="roomIdInput" :value="roomId">
      </h2>
      <DataTable stripedRows :value="playerList" class="mb-5">
        <Column field="role" :bodyStyle="{ textAlign: 'center' }">
          <template #body="slotProps">
            <FontAwesomeIcon v-if="slotProps.data.role === 1" :icon="['fas','crown']" style="color: #fa0"></FontAwesomeIcon>
          </template>
        </Column>
        <Column field="name" header="玩家暱稱" :bodyStyle="{ textAlign: 'center' }">
          <template #body="slotProps">
            <span :class="{ self: $socket.id === slotProps.data.socketId }">{{ slotProps.data.name }}</span>
          </template>
        </Column>
        <Column field="ready" header="準備狀態" :bodyStyle="{ textAlign: 'center' }">
          <template #body="slotProps">
            <i v-if="slotProps.data.ready" class="pi pi-check"></i>
            <img v-else src="@/assets/images/loading.svg" style="width: 32px; height: 32px">
          </template>
        </Column>
      </DataTable>

      <div class="btns mb-5">
        <Button
          :label="playerData.ready ? '取消準備' : '準備'"
          @click="toggleReady"
          class="p-button-rounded p-button-raised mx-2"
          :class="{ 'p-button-success': !playerData.ready, 'p-button-secondary': playerData.ready}"
        />
        <Button
          label="離開"
          @click="leaveRoom"
          class="p-button-rounded p-button-raised p-button-danger mx-2"/>
      </div>
      <div style="text-align: center">
        <Button
          v-if="playerData.role === 1"
          label="開始遊戲"
          class="p-button-rounded p-button-raised p-button-lg mx-2"
          :disabled="!everyoneReady"
        />
      </div>
    </div>
    <Toast position="top-center"/>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { mapState, mapGetters } from 'vuex'

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
    },
    toggleReady () {
      this.$socket.emit('toggleReady')
    },
    leaveRoom () {
      this.$socket.disconnect()
      this.$router.push('/play')
    }
  },
  sockets: {
    roomAnnouncement (msg) {
      this.$toast.add({ severity: 'info', detail: msg, life: 3000 })
    }
  },
  computed: {
    ...mapState('room', ['roomId', 'playerAmount', 'joinedPlayerAmount', 'playerList']),
    ...mapGetters('room', ['playerData', 'everyoneReady'])
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

    .btns {
      text-align: center;
    }

    .self {
      color: rgb(243, 61, 61);
      font-weight: bold;
    }

    .p-datatable {
      margin: 0 2rem;
    }

    .p-column-header-content {
      justify-content: center;
    }

    .p-progress-spinner {
      height: 1rem;
    }
  }

  @media (min-width: 992px) {
    #room {
      .p-datatable {
        margin: 0 12rem;
      }
    }
  }
</style>
