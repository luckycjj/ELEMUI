<template>
  <div :style="{height:height,width:width}" class="temperature">
    <div id="temperature-charts" style="height:100%;width:60%;float:left;"/>
    <div class="temperature-detail" style="height:100%;width:40%;float:right;">
      <p>当前车厢温度</p>
      <p><span id="temperatureValue"/>℃</p>
      <span class="error"><i class="fa fa-warning"/>警告：车厢温度超高 </span>
    </div>
  </div>

</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import '../../../../utils/CJJLED'
export default {
  name: 'Temperature',
  components: { echarts },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      now: null,
      width: '90%',
      oneDay: null,
      value: null,
      data: []
    }
  },
  computed: {
    height() {
      return (document.body.clientHeight * 0.25 - 15) + 'px'
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
    // debugger
    // 获取浏览器可视区域高度
    // console.log(self.clientHeight);
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }
    this.$nextTick(function() {
      this.go()
    })
  },
  methods: {
    go() {
      new window.LEDCJJ({
        dom: 'temperatureValue', // dom渲染
        number: '78.9', // 数字初始化
        getColor: '#FD666D', // 选中颜色
        size: 18 // px
      })
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        tooltip: {
          formatter: '{a} <br/> {c}%'
        },
        series: [
          {
            name: '温度',
            type: 'gauge',
            min: 0,
            max: 100,
            splitNumber: 10,
            axisLine: { // 坐标轴线
              lineStyle: { // 属性lineStyle控制线条样式
                width: 15,
                color: [[0.2, '#67E0E3'], [0.8, '#37A2DA'], [1, '#FD666D']]
              }
            },
            axisTick: { // 坐标轴小标记
              splitNumber: 5,
              length: 5, // 属性length控制线长
              lineStyle: { // 属性lineStyle控制线条样式
                color: 'rgba(255, 255, 255, 0.5)'
              }
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.5)',

              fontSize: 9
            },
            splitLine: { // 分隔线
              length: 15, // 属性length控制线长
              lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'rgba(255, 255, 255, 0.8)',
                width: 1
              }
            },
            title: {
              fontWeight: 'bolder',
              fontSize: 13
            },
            pointer: {
              width: 2
            },
            detail: { fontSize: 14, formatter: '{value}℃' },
            data: [{ value: 50, name: '' }]
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('temperature-charts'), 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.temperature{
  margin: 0px auto 35px  auto;
  border:2px solid rgba(27,47,64,1);
  color: #69D7D6;
  position: relative;
  .temperature-detail{
    font-weight:400;
    font-size: 17px;
    padding-top: 5px;
    #temperatureValue{
      display: inline-block;
      margin-right: 20px;
    }
      P{
margin-bottom: 40px;
    }
    .error{
      margin-top: 20px;
color: #F4F504;
font-size: 13px;
    position: absolute;
    right: 16px;
    bottom: 15px;
i{
  margin-right: 10px;
}
    }
  }
}
</style>
