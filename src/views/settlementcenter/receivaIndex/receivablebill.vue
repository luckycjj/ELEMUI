<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-if="checkPermission(['tms.settlement.collect.unreconcilize'])||checkPermission(['tms.settlement.payhost.noreconciliation'])" label="未对账" name="1">
        <rec-noaccount/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.settlement.collect.reconcilized'])||checkPermission(['tms.settlement.paypayhost.reconciliation'])" label="已对账" name="2">
        <rec-account/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import RecNoaccount from '../components/RecNoaccount'
import RecAccount from '../components/Recaccount'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Receivablebill',
  components: { RecNoaccount, RecAccount },
  data() {
    return {
      activeName: '1'
    }
  },
  created() {
    this.activeName = sessionStorage.getItem('TARGET' + this.$route.path) === null ? '1' : sessionStorage.getItem('TARGET' + this.$route.path)
  },
  methods: {
    checkPermission,
    handleClick(tab, event) {
      sessionStorage.setItem('TARGET' + tab.$route.path, event.target.id.split('-')[1])
    }

  }
}
</script>
