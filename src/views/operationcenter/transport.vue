<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane v-if="checkPermission(['tms.waybill.done'])" label="已派单">
        <sent-list/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.waybill.doing'])" label="进行中">
        <under-way-list/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.waybill.finished'])" label="已完成">
        <completed-list/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.waybill.all'])" label="全部">
        <all-list/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { SentList, UnderWayList, CompletedList, AllList } from './components'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Transport',
  components: { SentList, UnderWayList, CompletedList, AllList },
  data() {
    return {}
  },
  methods: {
    checkPermission
  }
}
</script>

