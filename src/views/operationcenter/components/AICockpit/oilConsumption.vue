<template>
  <div :style="{height:height,width:width}" class="oilConsumption">
    <div style="height:100%;width:50%;float:left;text-align: center;">
      <div id="oilConsumption-charts" style="height:80%;width:100%;float:left;"/>
      <span>当前油耗（L/100km）</span>
      <span class="error"><i class="fa fa-warning"/>警告：油耗超高 </span>
    </div>
    <div style="height:100%;width:50%;float:right;text-align: center;">
      <div id="xiehuo-charts" style="height:80%;width:100%;float:left;"/>
      <span>离卸货点（km）</span>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import 'echarts-liquidfill'
export default {
  name: 'OilConsumption',
  components: {},
  data() {
    return {
      width: '100%'
    }
  },
  computed: {
    height() {
      return (document.body.clientHeight * 0.3 - 15) + 'px'
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
        // title: [{
        //   text: '油耗',
        //   left: '45%',
        //   top: '13%',
        //   textAlign: 'center',
        //   textStyle: {
        //     fontWeight: 'normal',
        //     color: '#e9ea00',
        //     fontSize: 14,
        //     textAlign: 'center'
        //   }
        // }],
        series: [{
          type: 'liquidFill',
          name: '油耗',
          radius: '65%', // 调整大小
          shape: 'circle', // 修改形状，目前支持	'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
          color: ['#92F6FC'],
          outline: {
            borderDistance: 0, // 内环padding值
            itemStyle: {
              borderWidth: 1, // 圆边线宽度
              borderColor: '#4D6775'
            }
          },

          backgroundStyle: { // 内图 背景色 边
            color: 'rgba(0, 0, 0, 0)'
          },
          data: [{
            'name': '油耗',
            'value': '0.4',
            color: ['#92F6FC']
          }], // 其中第一个数值由键值对表示
          label: {
            position: 'bottom',
            normal: {
              textStyle: {
                fontSize: 14,
                color: '#92F6FC',
                insideColor: '#92F6FC'
              },
              formatter: '{c}'
            }
          }
        }]
      })
      this.chart2.setOption({
        title: {
          text: '80',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            color: '#2C727A',
            fontSize: '21'
          }
        },
        color: ['#6DB3BE'],

        series: [{
          name: 'Line 1',
          type: 'pie',
          clockWise: true,
          radius: ['50%', '66%'],
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [{
            value: 80,
            name: '01',
            itemStyle: {
              normal: {
                color: '#92F6FC',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          }, {
            name: '02',
            value: 20
          }]
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('oilConsumption-charts'), 'macarons')
      this.chart2 = echarts.init(document.getElementById('xiehuo-charts'), 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.oilConsumption{
      color: #D7DFE5;
      .error{
        display: inline-block;
        margin-top: 10px;
color: #F4F504;
font-size: 13px;
      }
  }
</style>

