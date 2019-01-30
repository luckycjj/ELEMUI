<template>
  <div class="contair">
    <p><i style=""/>运输中</p>
    <p><i/>空闲</p>
    <div id="trackmap" />
    <el-collapse-transition>
      <div id="carInfos" >
        <el-button v-show="isShowList" icon="el-icon-close" circle class="btn-close" @click="isShowList=false"/>
        <el-button v-show="!isShowList" icon="el-icon-arrow-up" circle class="btn-close" @click="isShowList=true"/>
        <el-form :model="listQuery" :inline="true" >
          <el-form-item label-width="80px" label="车牌号:" >
            <el-input v-model="listQuery.carno" autocomplete="off"/>
          </el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
        </el-form>
        <div v-show="isShowList">
          <el-table
            v-loading="listLoading"

            :data="carInfos"
            border
            fit
            highlight-current-row
            style="width: 100%;">
            <el-table-column prop="carno" label="车牌号" min-width="150"/>
            <el-table-column prop="carr_name" label="承运商" min-width="150"/>
            <el-table-column prop="vbillstatus" label="运单状态" min-width="150">
              <template slot-scope="scope">
                <span>{{ changeType(scope.row.vbillstatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="driver_name" label="司机" min-width="150"/>
            <el-table-column prop="driver_mobile" label="手机号码" min-width="150"/>
            <el-table-column prop="car_model" label="车型" min-width="150"/>
            <el-table-column prop="length" label="车长(m)" min-width="150"/>
            <el-table-column prop="load_weight" label="载重量（t/m³）" min-width="150">
              <template slot-scope="scope">
                <span>{{ changeFixed(scope.row.load_weight) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </div>
      </div>
    </el-collapse-transition>
    <a-i-cockpit ref="aicockpit" :show.sync="dialogAicockpitVisible" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { Timeline, TimelineItem, TimelineTitle } from '@/components/TimeLine'
import { gpsCarList } from '@/api/entrust'
import { AICockpit } from './components'
import BMap from 'BMap'

export default {
  name: 'Track',
  directives: { waves },
  components: {
    Pagination,
    Timeline,
    TimelineItem,
    TimelineTitle,
    AICockpit
  },
  data() {
    return {
      listLoading: false,
      dialogAicockpitVisible: false,
      listQuery: {
        carno: '',
        userCode: '15001962939',
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      isShowList: false,
      timelines: null,
      carInfos: null
    }
  },
  created() {
    // this.listQuery.entrustVbillno = this.$route.params && this.$route.params.entrustVbillno
    // this.getList()
  },
  mounted() {
    // 引用heatmap.js
    // 创建地图，这个写自己的创建地图方法，请确认你的地图能加载出来
    this.creatMap()
  },
  methods: {
    creatMap() {
      this.map = new BMap.Map('trackmap')
      this.map.centerAndZoom(new BMap.Point(121.480237, 31.236305), 12)// 初始化地图，设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom()// 允许滚轮缩放

      // eslint-disable-next-line no-undef
      var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }) // 设置版权控件位置
      this.map.addControl(cr) // 添加版权控件

      var bs = this.map.getBounds() // 返回地图可视区域
      cr.addCopyright({ id: 1, content: '<p><i style=""></i>运输中</p><p><i></i>空闲</p>', bounds: bs })
      // 编写自定义函数,创建标注
      // 随机向地图添加25个标注
      const bounds = this.map.getBounds()
      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()
      const lngSpan = Math.abs(sw.lng - ne.lng)
      const latSpan = Math.abs(ne.lat - sw.lat)

      for (let i = 0; i < 40; i++) {
        if (i > 30) {
          const myIcon = new BMap.Icon('@../../../static/car/car1.png', new BMap.Size(50, 33))
          const point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7))
          this.addMarker(point, myIcon)
        } else {
          const myIcon = new BMap.Icon('@../../../static/car/car.png', new BMap.Size(50, 33))
          const point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7))
          this.addMarker(point, myIcon)
        }
      }

      var styleJson = require('@../../../static/baiduMap/style.json')
      this.map.setMapStyle({ styleJson: styleJson })
    },
    getList() {
      this.listLoading = true
      gpsCarList(this.listQuery).then(response => {
        // debugger
        this.carInfos = response.data.records
        this.total = response.data.totalRecords || 0
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    addMarker(point, myIcon) {
      const marker = new BMap.Marker(point, { icon: myIcon })
      marker.addEventListener('click', this.clickMarker)
      this.map.addOverlay(marker)
    },
    clickMarker(e) {
      var p = e.target
      this.map.panTo(new BMap.Point(113.262232, 23.154345))
      this.map.centerAndZoom(new BMap.Point(p.getPosition().lng, p.getPosition().lat), 12)
      this.dialogAicockpitVisible = true
    },
    changeType(item) {
      if (item === 0) {
        return '待确认'
      } else if (item === 10) {
        return '已确认'
      } else if (item === 20) {
        return '司机出发'
      } else if (item === 31) {
        return '提货到达'
      } else if (item === 32) {
        return '开始装货'
      } else if (item === 33) {
        return '装货完毕'
      } else if (item === 41) {
        return '运输到达'
      } else if (item === 42) {
        return '开始卸货'
      } else if (item === 43) {
        return '卸货完毕'
      } else if (item === 50) {
        return '已签收'
      } else if (item === 55) {
        return '已回单'
      } else if (item === 60) {
        return '退单'
      } else {
        return ''
      }
    },
    changeFixed(item) {
      if (item) {
        return item.toFixed(3)
      } else {
        return '0.000'
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.contair{
height:calc(100vh - 190px);
}
  #trackmap{
      position: absolute;
      right: 0;
      top: 0;
      height:100%;
      width: 100%
  }
  #carInfos{
position: absolute;
padding: 20px;
    width: 100%;
    bottom: 0;
    z-index: 99;
    background-color: #fff;
    .btn-close{
position: absolute;
right: 20px;
    }
  }
</style>

