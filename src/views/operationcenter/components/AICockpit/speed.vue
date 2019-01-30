<template>
  <div :style="{height:height,width:width}" class="speed">
    <div class="speed-span" style="height:30%;">
      <span>当前速度:<span id="speedValue"/>km/h</span>
    </div>
    <div id="speed-charts" style="height:70%;"/>
  </div>

</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import '../../../../utils/CJJLED'
export default {
  name: 'Speed',
  components: { echarts },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '90%'
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
      oneDay: null,
      value: null,
      data: []
    }
  },
  computed: {
    height() {
      return (document.body.clientHeight * 0.4 - 30) + 'px'
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
        dom: 'speedValue', // dom渲染
        number: '78.8', // 数字初始化
        getColor: '#C0FDFF', // 选中颜色
        size: 23 // px
      })
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        backgroundColor: '',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        grid: {
          left: '20px',
          right: '30px',
          bottom: '40px',
          top: '20px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#0E2A43'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14,
                color: '#D5CBE8'
              }
            },
            axisTick: {
              show: false
            },
            data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40']
          }, {
            axisPointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#0E2A43'
              }
            },
            axisTick: {
              show: false
            },
            position: 'bottom',
            offset: 20
          }],
        yAxis: [{
          type: 'value',
          name: '速度（km/h）',
          min: 20,
          max: 120,
          splitNumber: 3,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#0E2A43'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14,
              color: '#D5CBE8'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '电信',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          stack: '总量',
          symbolSize: 5,
          animationDelay: 1000,
          animationDuration: 1000,
          markPoint: {
            data: [
              { type: 'max', name: '最大值' }
            ],
            animationDelay: 2000,
            animationDuration: 1000
          },
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'red' // 0% 处的颜色
                }, {
                  offset: 1, color: 'yellow' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              },
              opacity: 0.9
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 236, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 236, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: [80, 90, 90, 95, 100, 100, 95, 95, 80]
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('speed-charts'), 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.speed{
   background-image:url("../../../../../static/aiCockpit/speed_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    background-color: transparent;
    margin: 0px auto 40px  auto;
    #speedValue{
      display: inline-block;
      margin-right: 15px;
    }
    .speed-span{
        padding-top: 20px;
        font-size: 25px;
        color: #69D7D6;
        text-align: center;
    }

}
</style>
