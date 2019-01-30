<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane v-if="checkPermission(['tms.order.unsign'])" label="未派单">
        <outstanding-order/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.order.delivery'])" label="已发货">
        <shipped-order/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.order.finish'])" label="已完成">
        <completed-order/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.order.all'])" label="全部">
        <all-order/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OutstandingOrder from './components/OutstandingOrder'
import ShippedOrder from './components/ShippedOrder'
import CompletedOrder from './components/CompletedOrder'
import AllOrder from './components/AllOrder'
import checkPermission from '@/utils/permission' // 权限判断函数
// const calendarTypeOptions = [
//   { key: 'CN', display_name: 'China' },
//   { key: 'US', display_name: 'USA' },
//   { key: 'JP', display_name: 'Japan' },
//   { key: 'EU', display_name: 'Eurozone' }
// ]

// arr to obj ,such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'ComplexTable',
  components: { OutstandingOrder, ShippedOrder, CompletedOrder, AllOrder },
  methods: {
    checkPermission
  }
}
</script>
