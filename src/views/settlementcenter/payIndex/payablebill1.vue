<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未开票" name="1">
        <pay-unbilled/>
      </el-tab-pane>
      <el-tab-pane label="已开票" name="2">
        <pay-billed/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import PayUnbilled from '../components/PayUnbilled'
import PayBilled from '../components/PayBilled'

export default {
  name: 'Payablebill',
  components: { PayUnbilled, PayBilled },
  data() {
    return {
      activeName: '1'
    }
  },
  created() {
    this.activeName = sessionStorage.getItem('TARGET' + this.$route.path) === null ? '1' : sessionStorage.getItem('TARGET' + this.$route.path)
  },
  methods: {
    handleClick(tab, event) {
      sessionStorage.setItem('TARGET' + tab.$route.path, event.target.id.split('-')[1])
    }

  }
}
</script>
