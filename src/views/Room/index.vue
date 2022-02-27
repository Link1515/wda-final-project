<template>
  <div id="room" class="viewBox routerviewHeight" :class="{ BRtop: $route.path === '/room/start'}">
    <div v-if="$route.path === '/room'">
      <Title>
        <template #text>
          <span v-if="joinedPlayerAmount === playerAmount">玩家已全部加入!</span>
          <span v-else>等待玩家加入中 ... {{ joinedPlayerAmount }} / {{ playerAmount }}</span>
        </template>
      </Title>
      <div class="subViewBox mb-5" >
        <h2 style="margin: 0 auto 2rem; text-align: center;">
          遊戲間 ID: <span class="roomId">{{ roomId }}<i @click="copyRoomId" class="pi pi-copy ms-3"></i></span>
          <input type="hidden" ref="roomIdInput" :value="roomId">
          <QrcodeVue :value="serverAPI + '#/play/joingame?roomId=' + roomId" class="mt-3"/>
        </h2>
        <DataTable stripedRows :value="playerList" class="mb-5">
          <Column field="role" :bodyStyle="{ textAlign: 'center' }">
            <template #body="slotProps">
              <template v-if="slotProps">
                <FontAwesomeIcon v-if="slotProps.data.role === 1" :icon="['fas','crown']" style="color: #fa0" />
              </template>
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
          <Column field="ready" header="準備狀態" :bodyStyle="{ textAlign: 'center' }">
            <template #body="slotProps">
              <i v-if="slotProps.data.ready" class="pi pi-check" style="font-size: 24px; display: inline-block; height: 32px"></i>
              <img v-else src="@/assets/images/preparing.svg" style="width: 32px; height: 32px">
            </template>
          </Column>
        </DataTable>
        <div style="text-align: center" v-if="playerData">
          <Button
            v-if="playerData.role === 1"
            @click="start"
            label="開始遊戲"
            class="p-button-rounded p-button-raised p-button-lg mx-2"
            :disabled="!everyoneReady"
          />
        </div>
      </div>
      <!-- 初始配置 -->
      <div class="subViewBox mb-5">
        <div class="room_basicSetting mb-5">
          <h2 style="margin: 0 auto 1rem; text-align: center;">初始配置</h2>
          <hr class="mb-4">
          <h2 style="text-align: center">{{ gameInfo.name }}</h2>
          <p class="mb-5" style="text-align: center">{{ gameInfo.description }}</p>
          <div class="mx-auto mb-5" style="max-width: 600px">
            <img v-if="gameInfo.image" :src="gameInfo.image">
            <img v-else src="@/assets/images/image-placeholder.png">
          </div>
          <div v-if="playerData" class="col-12 mb-3" style="text-align: center;">
            <SelectButton v-model="camp" :options="campOptions" :disabled="playerData.ready" optionLabel="name"/>
          </div>
          <!-- 陣營身分 -->
          <div class="mx-auto" style="width: max-content">
            <div class="d-flex flex-column flex-md-row align-items-center mb-3">
              <div class="flex-shrink-0 mb-2 mb-md-0">陣營身分</div>
              <VueSelect
                v-if="playerData"
                v-model="campRole"
                :options="camp.value === 'goodCampRoleList' ? gameInfo.goodCampRoleList : gameInfo.badCampRoleList"
                label="name" class="VueSelectWidth ms-md-3"
                placeholder="選擇陣營身分"
                :disabled="playerData.ready"
              />
            </div>
          </div>
          <div class="invalidMsg mb-3" v-show="$v.campRole.$error" style="text-align: center">必須選擇陣營身分</div>
          <Card class="col-md-10 mx-auto mb-5" v-if="campRole.description">
            <template #title>
              {{ campRole.name }}
            </template>
            <template #content>
              {{ campRole.description }}
            </template>
          </Card>
          <!-- 功能身分 -->
          <div class="mx-auto" style="width: max-content">
            <div v-if="gameInfo.enableFunRole" class="d-flex flex-column flex-md-row align-items-center mb-3">
              <div class="flex-shrink-0 mb-2 mb-md-0">功能身分</div>
              <VueSelect
                v-model="funRole"
                :options="gameInfo.funRoleList"
                label="name" class="VueSelectWidth ms-md-3"
                placeholder="選擇功能身分"
                :disabled="playerData.ready"
              />
            </div>
          </div>
          <div class="invalidMsg mb-3" v-show="gameInfo.enableFunRole && $v.funRole.$error" style="text-align: center">必須選擇功能身分</div>
          <Card class="col-md-10 mx-auto" v-if="funRole.description">
            <template #title>
              {{ funRole.name }}
            </template>
            <template #content>
              {{ funRole.description }}
            </template>
          </Card>
        </div>
        <div class="btns" v-if="playerData">
          <Button
            :label="playerData.ready ? '取消準備' : '準備'"
            @click="toggleReady"
            class="p-button-rounded p-button-raised mx-2"
            :class="{ 'p-button-success': !playerData.ready, 'p-button-secondary': playerData.ready}"
          />
          <Button
            label="離開"
            @click="leaveRoom"
            class="p-button-rounded p-button-raised p-button-danger mx-2"
          />
        </div>
      </div>
      <Toast position="top-center"/>
    </div>
    <router-view />
  </div>
</template>

<script>
import SelectButton from 'primevue/selectbutton'
import QrcodeVue from 'qrcode.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Room',
  components: {
    SelectButton,
    QrcodeVue
  },
  data () {
    return {
      campOptions: [
        { name: '🙂 好人陣營', value: 'goodCampRoleList' },
        { name: '😈 壞人陣營', value: 'badCampRoleList' }
      ],
      camp: { name: '🙂 好人陣營', value: 'goodCampRoleList' },
      campRole: '',
      funRole: ''
    }
  },
  validations: {
    campRole: { picked },
    funRole: { picked }
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
      this.$v.$touch()
      if (this.gameInfo.enableFunRole && this.$v.$error) {
        this.$toast.add({ severity: 'error', summary: '錯誤', detail: '缺少必要項目', life: 3000 })
        return
      }
      if (this.$v.campRole.$error) {
        this.$toast.add({ severity: 'error', summary: '錯誤', detail: '缺少必要項目', life: 3000 })
        return
      }

      this.$socket.emit('toggleReady',
        {
          camp: this.camp.value,
          campRoleId: this.campRole.id,
          funRoleId: this.funRole.id
        })
    },
    leaveRoom () {
      this.$socket.disconnect()
      this.$store.commit('room/reset')
      this.$router.push('/play')
      this.$destroy()
    },
    start () {
      this.$socket.emit('start')
    }
  },
  sockets: {
    roomAnnouncement (msg) {
      this.$toast.add({ severity: 'info', detail: msg, life: 3000 })
    },
    start (startState) {
      this.$store.commit('room/start', startState)
      this.$v.$reset()
      this.camp = { name: '🙂 好人陣營', value: 'goodCampRoleList' }
      this.campRole = ''
      this.funRole = ''
      this.$router.push('/room/start').catch(() => {})
    }
  },
  computed: {
    serverAPI () {
      return process.env.VUE_APP_SERVERAPI
    },
    ...mapState('room', ['roomId', 'gameInfo', 'playerAmount', 'joinedPlayerAmount', 'playerList']),
    ...mapGetters('room', ['playerData', 'everyoneReady'])
  },
  watch: {
    camp () {
      this.campRole = '選擇陣營身分'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$socket.connected) {
        next('/play')
      }
    })
  }
}

// validation function
function picked (val) {
  return typeof val === 'object'
}
</script>

<style lang="scss">
#room {
  padding: 0 2rem 6rem;

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

  .p-datatable,
  .room_basicSetting {
    margin: 0 2rem;
  }

  .p-column-header-content {
    justify-content: center;
  }

  .p-progress-spinner {
    height: 1rem;
  }
}

.BRtop {
  border-radius: 8px !important;
}

@media (min-width: 768px) {
  #room {
    padding: 0 4rem 6rem;
  }
}

@media (min-width: 992px) {
  #room {
    .p-datatable,
    .room_basicSetting {
      margin: 0 12rem;
    }
  }
}
</style>
