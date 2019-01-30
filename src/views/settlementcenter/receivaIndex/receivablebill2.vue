<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-if="checkPermission(['tms.settlement.collect.unverify'])||checkPermission(['tms.settlement.payhost.unverify'])" label="未核销" name="1" >
        <rec-noverification/>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['tms.settlement.collect.verifyed'])||checkPermission(['tms.settlement.payhost.verifyed'])" label="已核销" name="2" >
        <rec-verification/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import RecNoverification from '../components/RecNoverification'
import RecVerification from '../components/RecVerification'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Receivablebill2',
  components: { RecNoverification, RecVerification },
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
