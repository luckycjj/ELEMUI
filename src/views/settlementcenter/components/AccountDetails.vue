<template>
  <div class="">
    <div>对账号：451212132</div>
    <el-table
      :data="tableData"
      border
      show-summary
      highlight-current-row
      style="width: 100%">
      <el-table-column prop="id" label="订单号" width="150"/>
      <el-table-column prop="name" label="委托客户" width="150"/>
      <el-table-column prop="amount1" label="结算客户" width="150"/>
      <el-table-column prop="amount2" label="费用日期" width="150"/>
      <el-table-column prop="amount3" label="提货地址" width="150"/>
      <el-table-column prop="amount3" label="件数" width="150"/>
      <el-table-column prop="amount3" label="立方" width="150"/>
      <el-table-column prop="amount3" label="运输费" width="150"/>
      <el-table-column prop="amount3" label="装货费" width="150"/>
      <el-table-column prop="amount3" label="合计" width="150"/>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'AccountDetails',
  components: {},

  props: {
  },
  data() {
    return {
      loading: false,
      tableData: []
    }
  },
  watch: {

  },
  created() {

  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

</style>

