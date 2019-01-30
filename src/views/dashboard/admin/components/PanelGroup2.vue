<template>
  <el-row :gutter="24" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="weight_count" :duration="2600" class="card-panel-num"/>
          <div class="card-panel-text">上月装载量（吨）</div>
        </div>
        <div class="card-panel-icon">
          <i class="fa fa-pie-chart"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="oilconsumption" :duration="3000" class="card-panel-num"/>
          <div class="card-panel-text">上月总油耗（L）</div>
        </div>
        <div class="card-panel-icon">
          <i class="fa fa-flask"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <a><count-to :start-val="0" :end-val="warning" :duration="3200" class="card-panel-num font-red-mint"/></a>
          <div class="card-panel-text">异常预警</div>
        </div>
        <div class="card-panel-icon font-red-mint">
          <i class="fa fa-warning"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { baseMsg } from '@/api/dashboard'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      weight_count: 6456,
      oilconsumption: 2546,
      warning: 7
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      baseMsg('15111111112').then(response => {
        this.weight_count = response.data.data.weight_count
        this.oilconsumption = response.data.data.fuelConsum
        this.warning = 7
      })
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.font-red-mint{
          color: #e43a45!important;
        }
.panel-group {
  .card-panel-col {
    margin-bottom: 24px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      position: absolute;
      top: 18px;
      right: 18px;
      font-size: 26px;
    }
    .card-panel-description {
      font-weight: bold;
      margin: 26px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
        margin-top: 16px;
      }
      .card-panel-num {
        font-size: 30px;
      }
    }
  }
}
</style>
