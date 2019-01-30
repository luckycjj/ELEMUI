<template>
  <div :style="{height:height,width:width}" class="mileage">
    <div id="mileage-charts" style="height:100%;width:60%;float:left;"/>
    <div class="mileage-detail" style="height:100%;width:40%;float:right;">
      <p style="margin-top:30px;">已完成里程数</p>
      <p style="font-size:26px;"><span id="mileageValue"/>%</p>
    </div>
  </div>

</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import '../../../../utils/CJJLED'
export default {
  name: 'Mileage',
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
        dom: 'mileageValue', // dom渲染
        number: '80', // 数字初始化
        getColor: '#FD666D', // 选中颜色
        size: 23 // px
      })
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: '80%',
          left: 'center',
          top: 'center', // top待调整
          textStyle: {
            color: '#fff',
            fontSize: 30,
            fontFamily: 'DINAlternate-Bold'
          },
          subtextStyle: {
            color: '#ff',
            fontSize: 15,
            fontFamily: 'PingFangSC-Regular',
            top: 'center'
          },
          itemGap: -4// 主副标题间距
        },
        series: [{
          name: 'pie1',
          type: 'pie',
          clockWise: true,
          radius: ['62%', '65%'],
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
            name: 'completed',
            itemStyle: {
              normal: {
                borderWidth: 5,
                borderColor: {
                  colorStops: [{
                    offset: 0,
                    color: '#80E5F1' || '#11365A' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#80E5F1' || '#11365A' // 100% 处的颜色
                  }]
                },
                color: '#80E5F1',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          }, {
            name: 'gap',
            value: 100 - 80,
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0
              }
            }
          }]
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('mileage-charts'), 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mileage{
  margin: auto;
  border:2px solid rgba(27,47,64,1);
  color: #69D7D6;
  .mileage-detail{
    font-weight:400;
    font-size: 17px;
    padding-top: 5px;
    #mileageValue{
      display: inline-block;
      margin-right: 20px;
    }
    P{
margin-bottom: 30px;
    }
  }
}
</style>
