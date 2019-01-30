<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-if="checkPermission(['tms.settlement.pay.noreconciliation'])" label="未对账" name="1">
        <pay-noaccount/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.settlement.pay.reconciliation'])" label="已对账" name="2">
        <pay-account/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PayNoaccount from '../components/PayNoaccount'
import PayAccount from '../components/PayAccount'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Payablebill',
  components: { PayNoaccount, PayAccount },
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
