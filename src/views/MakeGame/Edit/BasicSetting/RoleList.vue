<template>
  <div id="rolelist">
    <Accordion :multiple="true" @tab-close="editRoleList($event, listType)">
      <component :is="'AccordionTab'" v-for="role in $store.state.game[listType]" :key="role.id" :header="role.name">
        <p v-if="!role.isEditing" v-html="transferWarp(role.description) || '無描述'"></p>
        <template v-else>
          <label for="roleName" class="me-2">名稱</label>
          <InputText id="roleName" v-model="editModel.name" />
          <Textarea v-model="editModel.description" class="my-3" :autoResize="true" rows="3" />
        </template>
        <div class="AccordionTab_footer">
          <template v-if="!role.isEditing">
            <Button label="編輯" @click="editRoleList($event, listType)" :data-target="role.id" class="p-button-rounded p-button-raised p-button-secondary ms-2" />
            <Button label="刪除" @click="removeRoleList($event, listType)" :data-target="role.id" class="p-button-rounded p-button-raised p-button-danger ms-2" />
          </template>
          <template v-else>
            <Button label="保存" @click="updateRoleList($event, listType)" :data-target="role.id" class="p-button-rounded p-button-raised p-button-success ms-2" />
            <Button label="取消" @click="editRoleList($event, listType)" class="p-button-rounded p-button-raised p-button-danger ms-2" />
          </template>
        </div>
      </component>
    </Accordion>
  </div>
</template>

<script>
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

import { mapState } from 'vuex'

export default {
  components: {
    Accordion,
    AccordionTab
  },
  props: {
    listType: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      editModel: {
        name: '',
        description: ''
      },
      deleteTarget: '',
      delete: {
        listType: '',
        target: ''
      }
    }
  },
  methods: {
    removeRoleList (e, listType) {
      this.$swal({
        title: '確定要刪除此角色?',
        text: '注意: 與此角色相關的流程將會一併被刪除 !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#607D8B',
        confirmButtonText: '確認',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          const target = e.target.dataset.target
          this.$store.commit('game/removeRoleList', { listType, target })
          this.$swal({
            title: '成功!',
            text: '角色成功刪除',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    },
    editRoleList (e, listType) {
      const target = e.target?.dataset.target
      this.$store.commit('game/editRoleList', { listType, target })
      if (target) {
        const editingData = this[listType].filter(item => item.id === target)[0]
        this.editModel.name = editingData.name
        this.editModel.description = editingData.description
      }
    },
    updateRoleList (e, listType) {
      const target = e.target.dataset.target
      this.$store.commit('game/updateRoleList', { listType, target, ...this.editModel })
    },
    transferWarp (val) {
      return val.split('\n').join('<br />')
    }
  },
  computed: {
    ...mapState('game', ['goodCampRoleList', 'badCampRoleList', 'funRoleList'])
  }
}
</script>

<style lang="scss">
#rolelist {
  .p-inputtextarea {
    border-radius: 0;
    width: 80%;
  }

  .p-accordion-header-link:focus {
    box-shadow: none;
  }

  .AccordionTab_footer {
    text-align: right;

    span {
      pointer-events: none;
    }
  }

  .p-toast-message-content {
    justify-content: center;
  }

  .p-toast-icon-close {
    display: none;
  }
}
</style>
