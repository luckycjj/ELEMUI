<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-if="checkPermission(['tms.settlement.collect.unbilled'])||checkPermission(['tms.settlement.payhost.unbilled'])" label="未开票" name="1" >
        <rec-unbilled />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.settlement.collect.billed'])||checkPermission(['tms.settlement.payhost.billed'])" label="已开票" name="2">
        <rec-billed/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RecUnbilled from '../components/RecUnbilled'
import RecBilled from '../components/RecBilled'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Receivablebill1',
  components: { RecUnbilled, RecBilled },
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
