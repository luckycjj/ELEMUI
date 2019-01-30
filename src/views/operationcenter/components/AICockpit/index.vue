<template>
  <el-dialog :visible.sync="visible" :fullscreen="true" class="aiCockpit" @close="close">
    <el-row :gutter="24">
      <el-col :xs="8" :sm="8" :lg="7">
        <speed/>
        <temperature/>
        <mileage/>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="10" style="position: relative;">
        <div class="middle-header">
          沪A86446
        </div>
        <camera/>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="7" style="border: 2px solid #1b2f40;">
        <panel/>
        <oilConsumption/>
        <drive-time/>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import speed from './speed'
import temperature from './temperature'
import mileage from './mileage'
import camera from './camera'
import panel from './panel'
import oilConsumption from './oilConsumption'
import driveTime from './driveTime'

export default {
  name: 'AICockpit',
  components: { speed, temperature, mileage, camera, panel, oilConsumption, driveTime },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    onselect: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      visible: this.show
    }
  },
  watch: {
    show(val) {
      this.visible = val// 新增result的watch，监听变更并同步到myResult上
    }
  },
  created() {
  },
  methods: {
    close() {
      this.$emit('update:show', false)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.aiCockpit {
   background-color:#161E44;
  .middle-header{
    position: absolute;
    top: -30px;
    margin: auto;
    width: 100%;
    height: 70px;
    background-image:url("../../../../../static/aiCockpit/middle-header.png");
    background-repeat: no-repeat;
    background-size: auto 100% ;
    -moz-background-size: 100% 100%;
    background-position:center;
    text-align: center;
    font-size:30px;
    color:#fff;
    padding-top: 11px;
  }
  & /deep/ {
    .el-dialog{
      background:none;
    }
    .el-dialog__header{
      position: absolute;
      width: 60px;
      height: 60px;
      right: 20px;
          z-index: 9;
    }
    .el-dialog__body{
      padding: 30px 20px;
    }
  }
}
</style>

