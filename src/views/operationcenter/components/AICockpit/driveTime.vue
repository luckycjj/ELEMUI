<template>
  <div :style="{height:height,width:width}" class="driveTime">
    <div style="height:100%;width:50%;float:left;text-align: center;">
      <div id="drive-charts" style="height:80%;width:100%;float:left;"/>
      <span>驾驶时长（h）</span>
      <span class="error"><i class="fa fa-warning"/>警告：油耗超高 </span>
    </div>
    <div style="height:100%;width:50%;float:right;text-align: center;">
      <div id="xiuxi-charts" style="height:80%;width:100%;float:left;"/>
      <span>休息时长（h）</span>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import 'echarts-liquidfill'
export default {
  name: 'DriveTime',
  components: {},
  data() {
    return {
      width: '100%'
    }
  },
  computed: {
    height() {
      return (document.body.clientHeight * 0.3 - 25) + 'px'
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  created() {

  },
  mounted() {
    // 获取浏览器可视区域高度
    // console.log(self.clientHeight);
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
        if (this.chart2) {
          this.chart2.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }
  },
  methods: {
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        series: [
          {
            type: 'gauge',
            name: '业务指标',
            radius: '70%',
            startAngle: '225',
            endAngle: '-45',
            splitNumber: '20',
            pointer: {
              show: false
            },
            detail: {
              offsetCenter: [0, 10],
              formatter: '{value}'
            },
            data: [{ value: 60, name: '完成率' }],
            title: [{
              show: true,
              offsetCenter: [0, '20px'],
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 16
              }
            }, {
              show: true,
              offsetCenter: [0, '40px'],
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 16
              }
            }],
            axisLine: {
              show: true,
              lineStyle: {
                color: [[0, '#92F6FC'], [0.60, '#92F6FC'], [1, '#6D8B90']],
                width: 20,
                // shadowBlur: 15,
                // shadowColor: '#92F6FC',
                // shadowOffsetX: 0,
                // shadowOffsetY: 0,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              length: 25,
              lineStyle: {
                color: '#00377a',
                width: 2,
                type: 'solid',
                shadowColor: '#00377a',
                shadowBlur: 25,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                opacity: 0.5
              }
            },
            axisLabel: {
              show: false
            }
          }
        ]
      })
      this.chart2.setOption({
        series: [
          {
            type: 'gauge',
            name: '业务指标',
            radius: '70%',
            startAngle: '225',
            endAngle: '-45',
            splitNumber: '20',
            pointer: {
              show: false
            },
            detail: {
              offsetCenter: [0, 10],
              formatter: '{value}'
            },
            data: [{ value: 60, name: '完成率' }],
            title: [{
              show: true,
              offsetCenter: [0, '20px'],
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 16
              }
            }, {
              show: true,
              offsetCenter: [0, '40px'],
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 16
              }
            }],
            axisLine: {
              show: true,
              lineStyle: {
                color: [[0, '#92F6FC'], [0.60, '#92F6FC'], [1, '#6D8B90']],
                width: 20,
                // shadowBlur: 15,
                // shadowColor: '#92F6FC',
                // shadowOffsetX: 0,
                // shadowOffsetY: 0,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              length: 25,
              lineStyle: {
                color: '#00377a',
                width: 2,
                type: 'solid',
                shadowColor: '#00377a',
                shadowBlur: 25,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                opacity: 0.5
              }
            },
            axisLabel: {
              show: false
            }
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('drive-charts'), 'macarons')
      this.chart2 = echarts.init(document.getElementById('xiuxi-charts'), 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.driveTime{
      color: #D7DFE5;
      padding-bottom: 10px;
       .error{
        display: inline-block;
        margin-top: 10px;
color: #F4F504;
font-size: 13px;
      }
  }
</style>

