<template>
  <div style="height:calc(100vh - 190px);">
    <div class="tracking">
      <h3/>
      <timeline timeline-theme="#f4f4f4">
        <timeline-item v-for="(item,i) in timelines" :key="item.tracking_status" :num="i" bg-color="#f4f4f4" icon-size="small">
          <div class="track-timeline-panel">
            <div class="track-timeline-heading">
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="16">
                  <h4 v-if="i===0" style="font-weight:600">{{ changeType(item.tracking_status) }}
                    <el-popover
                      v-if="item.exp_flag==='Y'"
                      placement="right"
                      width="480"
                      trigger="hover"
                      @show="expFlag(entrustVbil,item.tracking_status)"
                      @hide="hideExp()"
                    >
                      <p class="yichangP">异常信息</p>
                      <div class="messageBox">
                        <div v-for="(item,i) in expList" :key="i">
                          <div v-if="i === 0 || (i > 0 && lookMoreExp)" class="errormessage">
                            <h4><i class="el-icon-date" /> &nbsp;&nbsp;{{ item.create_time }}</h4>
                            <h4><i class="fa fa-warning font-red"/> &nbsp;&nbsp;{{ changeExp(item.exp_type) }}</h4>
                          </div>
                        </div>
                        <div v-if="expList.length > 0" class="peoplemessage">
                          <h4><i class="fa fa-user" /> &nbsp;&nbsp;{{ expList[0].driver_name }}</h4>
                          <h4><i class="el-icon-phone" /> &nbsp;&nbsp;{{ expList[0].mobile }}</h4>
                          <img src="../../../static/car/tel.png">
                        </div>
                      </div>
                      <span v-if="expList.length > 1 && !lookMoreExp" @click="lookMoreExp = !lookMoreExp">查看全部</span>
                      <i slot="reference" class="fa fa-warning font-red"/>
                    </el-popover>
                  </h4>

                  <h4 v-else style="color:grey">{{ changeType(item.tracking_status) }}
                    <el-popover
                      v-if="item.exp_flag==='Y'"
                      placement="right"
                      width="480"
                      trigger="hover"
                      @show="expFlag(entrustVbil,item.tracking_status)"
                      @hide="hideExp()"
                    >
                      <p class="yichangP">异常信息</p>
                      <div class="messageBox">
                        <div v-for="(item,i) in expList" :key="i">
                          <div v-if="i === 0 || (i > 0 && lookMoreExp)" class="errormessage">
                            <h4><i class="el-icon-date" /> &nbsp;&nbsp;{{ item.create_time }}</h4>
                            <h4><i class="fa fa-warning font-red"/> &nbsp;&nbsp;{{ changeExp(item.exp_type) }}</h4>
                          </div>
                        </div>
                        <div v-if="expList.length > 0" class="peoplemessage">
                          <h4><i class="fa fa-user" /> &nbsp;&nbsp;{{ expList[0].driver_name }}</h4>
                          <h4><i class="el-icon-phone" /> &nbsp;&nbsp;{{ expList[0].mobile }}</h4>
                          <img src="../../../static/car/tel.png">
                        </div>
                      </div>
                      <span v-if="expList.length > 1 && !lookMoreExp" @click="lookMoreExp = !lookMoreExp">查看全部</span>
                      <i slot="reference" class="fa fa-warning font-red"/>
                    </el-popover>
                  </h4>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="8">
                  <span v-if="i!==0" class="time" style="color:grey">{{ item.tracking_time }}</span>
                  <span v-else class="time">{{ item.tracking_time }}</span>
                </el-col>
              </el-row>
            </div>
            <div v-if="item.body" class="track-timeline-body" style="padding-bottom: 10px;">
              <p>在途事件在途事件</p>
              <a href="#" style="margin:15px;color: orange"><i class="fa fa-phone"/> 联系客服</a>
              <a href="aiDrive.html" target="_blank" style="z-index: 9999999999;position: absolute;" class="font-blue"><i class="fa fa-video-camera"/> 远程监控</a>
            </div>
          </div>
        </timeline-item>
      </timeline>
    </div>
    <div id="trackmap" />
    <el-collapse-transition>
      <div v-show="isShowList" id="carInfos" >
        <el-table
          v-loading="listLoading"
          :data="carInfos"
          border
          fit
          highlight-current-row
          style="width: 100%;">
          <el-table-column prop="carno" label="车牌号" min-width="150"/>
          <el-table-column prop="carr_name" label="承运商" min-width="150"/>
          <el-table-column prop="vbillstatus" label="运单状态" min-width="150"/>
          <el-table-column prop="driver_name" label="司机" min-width="150"/>
          <el-table-column prop="driver_mobile" label="手机号码" min-width="150"/>
          <el-table-column prop="car_model" label="车型" min-width="150"/>
          <el-table-column prop="length" label="车长" min-width="150"/>
          <el-table-column prop="load_weight" label="载货量（t）" min-width="150">
            <template slot-scope="scope">
              <span>{{ changeFixed(scope.row.load_weight) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="load_volume" label="体积(m³)" min-width="150"/> -->
        </el-table>
      </div>>
    </el-collapse-transition>
  </div>
</template>

<script>
import { Timeline, TimelineItem, TimelineTitle } from '@/components/TimeLine'
import ScrollPane from '@/components/ScrollPane'
import { waybillTracking, nodeOfExpInfo } from '@/api/entrust'
import BMap from 'BMap'
export default {
  name: 'Track',
  components: {
    ScrollPane,
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data() {
    return {
      listLoading: false,
      listQuery: {
        entrustVbillno: '',
        userCode: '13512345678'
      },
      isShowList: true,
      timelines: null,
      carInfos: null,
      expList: [],
      lookMoreExp: false,
      entrustVbil: ''
    }
  },
  created() {
    this.listQuery.entrustVbillno = this.$route.params && this.$route.params.entrustVbillno
    this.getList()
  },
  mounted() {
    // 引用heatmap.js
    // 创建地图，这个写自己的创建地图方法，请确认你的地图能加载出来
    this.creatMap()
  },
  methods: {
    creatMap() {
      this.map = new BMap.Map('trackmap')
      this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 12)// 初始化地图，设置中心点坐标和地图级别
      // this.map.enableScrollWheelZoom()// 允许滚轮缩放
      var driving = new BMap.DrivingRoute(this.map, { renderOptions: { map: this.map, panel: 'r-result', autoViewport: true }})
      driving.search('上海', '苏州')

      var styleJson = require('@../../../static/baiduMap/style.json')
      this.map.setMapStyle({ styleJson: styleJson })
    },
    getList() {
      this.listLoading = true
      waybillTracking(this.listQuery).then(response => {
        this.timelines = response.data.data.waybillTrackingList
        console.log(this.timelines)
        this.entrustVbil = response.data.data.entrustVbil
        this.carInfos = response.data.data.carInfo
        for (const item of this.carInfos) {
          item.vbillstatus = this.changeType(item.vbillstatus)
        }
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    changeType(type) {
      if (type === 20) {
        return '司机出发'
      } else if (type === 31) {
        return '提货到达'
      } else if (type === 32) {
        return '开始装货'
      } else if (type === 33) {
        return '装货完毕'
      } else if (type === 41) {
        return '运输到达'
      } else if (type === 42) {
        return '开始卸货'
      } else if (type === 43) {
        return '卸货完毕'
      } else if (type === 50) {
        return '已签收'
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
    },
    expFlag(item, msg) {
      const data = {
        nodeStatus: msg,
        entrustVbillno: item
      }
      nodeOfExpInfo(data).then(response => {
        // console.log(response)
        const list = []
        for (var i = 0; i < response.data.datas.length; i++) {
          list.unshift(response.data.datas[i])
        }
        this.expList = list
        this.lookMoreExp = false
      })
    },
    hideExp() {
      this.expList = []
      this.lookMoreExp = false
    },
    changeExp(item) {
      if (item === 1) {
        return '货物破损'
      } else if (item === 4) {
        return '提货地址有误'
      } else if (item === 3) {
        return '时效异常'
      } else if (item === 10) {
        return '等待费'
      } else if (item === 8) {
        return '运费'
      } else if (item === 2) {
        return '货物错误'
      } else if (item === 0) {
        return '货物丢失'
      } else if (item === 6) {
        return '无人签收'
      } else if (item === 12) {
        return '收货地址有误'
      } else if (item === 9) {
        return '仓库费'
      } else if (item === 5) {
        return '无法提货'
      } else {
        return '其他'
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .tracking{
    width:30%;
    height:90%;
    position: absolute;
    left: 0px;
    top: 0px;
    overflow: auto;
    .timeline-item {
      .track-timeline-panel {
        width: calc(100% - 25px);
        width: -moz-calc(100% - 25px);
        width: -webkit-calc(100% - 25px);
        border: 1px solid #dcdcdc;
        background: #ffffff;
        position: relative;
        &::before{
          position: absolute;
          top: 15px;
          right: -15px;
          display: inline-block;
           border-top: 14px solid transparent;
    border-left: 14px solid #dcdcdc;
    border-right: 0 solid #dcdcdc;
    border-bottom: 14px solid transparent;
          content: " ";
          border-left-width: 0;
          border-right-width: 15px;
          left: -15px;
          right: auto;
        }
        &::after {
          position: absolute;
          top: 16px;
          right: -14px;
          display: inline-block;
          border-top: 14px solid transparent;
          border-left: 14px solid #f4f4f4;
          border-right: 0 solid #f4f4f4;
          border-bottom: 14px solid transparent;
          content: " ";
          border-left-width: 0;
          border-right-width: 14px;
          left: -14px;
          right: auto;
        }
        .track-timeline-heading {
          background-color: #f4f4f4;
          padding: 10px 15px;
          h4 {
                margin: 10px 0;
              font-weight: 400;
              color: #4679bd;
          }
          .time {
            // float: left;
            position: absolute;
            right: 10px;
            top: 10px;
            // padding-top: 20px;
          }
        }
      }
    }
  }
  #trackmap{
      position: absolute;
      right: 0;
      top: 0;
      height:100%;
      width: 70%
  }
  #carInfos{
position: absolute;
    width: 100%;
    bottom: 0;
    z-index: 99;
    background-color: #fff;
  }
  .messageBox{
    position: relative;
  }
  .yichangP{
     text-align: center;
     font-size: 18px;
    color:#666666;
    line-height: 26px;
    margin: 0;
  }
  .peoplemessage{
    width:200px;
    padding:0px 10px;
    position: absolute;
    margin-top: -43.92px;
    right:0;
    top:50%;
  }
  .errormessage{
    width:240px;
    padding:0px 10px;
    position: relative;
  }
  .peoplemessage img{
    width : 50px;
    position: absolute;
    top:50%;
    margin-top: -25px;
    right:15px;
    cursor: pointer;
  }
  .peoplemessage h4,.errormessage h4{
     font-size: 13px;
    font-weight: normal;
  }
</style>

