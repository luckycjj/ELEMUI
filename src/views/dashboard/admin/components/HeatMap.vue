<template>
  <div id="heatmap" :class="className" :style="{height:height,width:width}"/>
</template>
<script>
import { hotMap } from '@/api/dashboard'
import BMap from 'BMap'
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
      default: '628px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      map: null,
      heatmapOverlay: null
    }
  },
  mounted() {
    // 引用heatmap.js
    // 创建地图，这个写自己的创建地图方法，请确认你的地图能加载出来
    this.creatMap()
    // 一定要先让地图加载出来才加载热力图，我这里做演示直接写个setTimeout了
    setTimeout(() => { this.getHeatmap() }, 2000)
  },
  methods: {
    creatMap() {
      this.map = new BMap.Map('heatmap')
      var point = new BMap.Point(121.480237, 31.236305)
      this.map.centerAndZoom(point, 8)// 初始化地图，设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom()// 允许滚轮缩放
    },
    getHeatmap() {
      // 请求雷达数据,雷达数据需要lng,lat,count 三种数据
      // var bigdata = require('@../../../static/heatmap/heatmap.json')
      hotMap('15111111112').then(response => {
        var bigdata = response.data.datas
        // 关键是下面的三行
        // 其中map是new BMap.Map()创建的地图实例,其他的热力图属性（radius，opacity这种）可以在百度地图接口实例中调试体验，http://lbsyun.baidu.com/jsdemo.htm#c1_15
        this.heatmapOverlay = new window.BMapLib.HeatmapOverlay({ 'radius': 20 })
        this.map.addOverlay(this.heatmapOverlay)
        this.heatmapOverlay.setDataSet({ data: bigdata, max: 50 })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#heatmap{
  margin-bottom: 16px;
}
</style>
