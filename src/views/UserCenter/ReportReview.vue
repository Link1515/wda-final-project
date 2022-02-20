<template>
  <div id="ReportReview">
    <h1>用戶回報</h1>
    <DataTable v-if="reports.length > 0" stripedRows :value="reports">
      <Column header="用戶 ID" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          <span class="authorId">{{ slotProps.data.userId }}</span>
        </template>
      </Column>
      <Column field="title" header="標題" :bodyStyle="{ textAlign: 'center' }"/>
      <Column header="操作" :bodyStyle="{ textAlign: 'center' }">
        <template #body="slotProps">
          <Button label="查看" @click="showReport(slotProps.data)" class="p-button-rounded p-button-raised mx-1"/>
          <Button label="刪除" @click="deleteReport(slotProps.data._id)" class="p-button-rounded p-button-raised p-button-danger mx-1"/>
        </template>
      </Column>
    </DataTable>

    <Dialog :visible.sync="dialogDisplay" position="center" :showHeader="false" modal dismissableMask>
      <div style="max-height: 70vh; min-width: 60vw">
        <h2>{{ dialog.title }}</h2>
        <p>{{ dialog.text }}</p>
      </div>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'ReportReview',
  data () {
    return {
      dialogDisplay: false,
      reports: [],
      dialog: {
        title: '',
        text: ''
      }
    }
  },
  methods: {
    showReport (report) {
      this.dialogDisplay = true
      this.dialog.title = report.title
      this.dialog.text = report.text
    },
    async deleteReport (reportId) {
      try {
        const result = await this.$swal({
          icon: 'warning',
          title: '是否確定要刪除?',
          showCancelButton: true
        })
        if (result.isDismissed) return

        await this.serverAPI.delete('/reports/deleteReport/' + reportId, {
          headers: {
            authorization: 'Bearer ' + this.userInfo.token
          }
        })

        this.reports = this.reports.filter(report => report._id !== reportId)

        this.$swal({
          icon: 'success',
          title: '成功',
          text: '成功刪除'
        })
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '失敗',
          text: error.response.data.message
        })
      }
    }
  },
  async created () {
    try {
      const { data } = await this.serverAPI.get('/reports/getReports', {
        headers: {
          authorization: 'Bearer ' + this.userInfo.token
        }
      })
      this.reports = data.result
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: error.response.data.message
      })
    }
  }
}
</script>

<style lang="scss">
#ReportReview {
  .authorId {
    font-size: 10px;
  }

  .p-column-header-content {
    justify-content: center;
  }
}

@media (min-width: 768px) {
  #ReportReview {
    .authorId {
      font-size: 1rem;
    }
  }
}
</style>
