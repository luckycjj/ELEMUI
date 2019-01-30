<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="应收费用" name="1">
        <receivable-cost/>
      </el-tab-pane>
      <el-tab-pane label="应付费用" name="2">
        <payable-cost/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ReceivableCost from './components/ReceivableCost'
import PayableCost from './components/PayableCost'

export default {
  name: 'Costlist',
  components: { ReceivableCost, PayableCost },
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
