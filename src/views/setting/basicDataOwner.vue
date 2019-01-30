<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="客户管理" name="1">
        <ower-manage/>
      </el-tab-pane>
      <el-tab-pane label="货品信息" name="2">
        <pro-message/>
      </el-tab-pane>
      <el-tab-pane label="地址管理" name="3">
        <add-message/>
      </el-tab-pane>
      <el-tab-pane label="费用配置" name="4">
        <price-manage/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import owerManage from './basicDataOwner/owerManage'
import proMessage from './basicDataOwner/proMessage'
import addMessage from './basicDataOwner/addMessage'
import priceManage from './basicDataOwner/priceManage'
export default {
  name: 'BasicDataOwner',
  components: { owerManage, proMessage, addMessage, priceManage },
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
