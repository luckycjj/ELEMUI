<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import { distance } from '@/api/dashboard'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

// const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '140px'
    }
  },
  data() {
    return {
      chart: null,
      chartData: []
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
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions(seriesData) {
      var titlename = ['太原市民政局']
      var valdata = [10]
      var myColor = ['#1089E7']
      this.chart.setOption({
        title: {
          text: '有效里程数',
          subtext: '数据来自网络'
        },
        grid: {
          bottom: '10%'
        },
        xAxis: {
          show: false
        },
        yAxis: [{
          show: true,
          data: titlename,
          inverse: true,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            formatter: function(value, index) {
              return [
                '{lg|' + (index + 1) + '}' + '{title|' + value + '} '
              ].join('\n')
            }
          }
        }, {
          show: true,
          inverse: true,
          data: valdata,
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }],
        series: [
          {
            name: '条',
            type: 'bar',
            yAxisIndex: 0,
            data: seriesData,
            barWidth: 30,
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: function(params) {
                  var num = myColor.length
                  return myColor[params.dataIndex % num]
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: '{c}%'
              }
            }
          },
          {
            name: '框',
            type: 'bar',
            yAxisIndex: 1,
            barGap: '-100%',
            data: [100, 100],
            barWidth: 30,
            itemStyle: {
              normal: {
                color: 'none',
                borderColor: '#00c1de',
                borderWidth: 3,
                barBorderRadius: 15
              }
            }
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      distance('15111111112').then(response => {
        this.chartData.push((response.data.data.validDistance / response.data.data.acountDistance) * 100)
      })
      this.setOptions(this.chartData)
    }
  }
}
</script>
