<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="司机管理" name="1">
        <driver-manage/>
      </el-tab-pane>
      <el-tab-pane label="车辆类型" name="2">
        <car-type/>
      </el-tab-pane>
      <el-tab-pane label="车辆管理" name="3">
        <car-manage/>
      </el-tab-pane>
      <el-tab-pane label="路线信息" name="4">
        <add-message/>
      </el-tab-pane>
      <el-tab-pane label="地址管理" name="5">
        <adds-message/>
      </el-tab-pane>
      <el-tab-pane label="客户管理" name="6">
        <owner-manage/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import driverManage from './basicDataCarrier/driverManage'
import carType from './basicDataCarrier/carType'
import carManage from './basicDataCarrier/carManage'
import addMessage from './basicDataCarrier/addMessage'
import addsMessage from './basicDataOwner/addMessage'
import ownerManage from './basicDataCarrier/ownerManage'
export default {
  name: 'BasicDataCarrier',
  components: { driverManage, carType, carManage, addMessage, addsMessage, ownerManage },
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

<style scoped>

</style>
