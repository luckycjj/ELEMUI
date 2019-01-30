
<template>
  <div>
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.startTime"
        type="date"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        value-format="yyyy-MM-dd"
        placeholder="委托开始日期"/>
      <el-date-picker
        v-model="listQuery.endTime"
        type="date"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        value-format="yyyy-MM-dd"
        placeholder="委托结束日期"/>
      <el-input v-model="listQuery.vbillno" placeholder="运单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.entrustState" placeholder="运单状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in entrustStateOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
      <el-collapse-transition>
        <div v-show="isCriteriaMore">
          <el-input v-model="listQuery.invoiceVbillno" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.goodsName" placeholder="货物名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <!-- <el-select v-model="listQuery.pk_trans_type" placeholder="业务类型" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in pk_trans_typeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select> -->
          <el-input v-model="listQuery.deliAddr" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.arriAddr" placeholder="卸货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        </div>
      </el-collapse-transition>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :max-height="tableHeight"
      border
      fit
      highlight-current-row
      tooltip-effect="light"
      style="width: 100%;">
      <el-table-column type="selection" min-width="55" />
      <el-table-column align="center" prop="urgent_level" label="优先级" width="80">
        <template slot-scope="scope">
          <i v-if="scope.row.urgent_level===1" class="fa fa-bolt font-red font-lg"/>
          <i v-if="scope.row.urgent_level===0" class="fa fa-bolt font-grey font-lg"/>
        </template>
      </el-table-column>
      <el-table-column prop="vbillstatus" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.vbillstatus=='已确认'" class="font-green">{{
          scope.row.vbillstatus }}</span>
          <span v-else>{{ scope.row.vbillstatus | entrustStateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="YCSJ" label="异常事件" width="80">
        <template slot-scope="scope">

          <el-popover
            v-if="scope.row.exp_flag==='Y'"
            placement="right"
            width="480"
            trigger="hover"
            @show="expFlag(scope.row.vbillno)"
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
                <img src="../../../../static/car/tel.png">
              </div>
            </div>
            <span v-if="expList.length > 1 && !lookMoreExp" @click="lookMoreExp = !lookMoreExp">查看全部</span>
            <!-- <p>{{ scope.row.exp_flag }}</p> -->
            <i slot="reference" class="fa fa-warning font-red"/>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column prop="segment_vbillno" label="托单号" min-width="180"/>
      <el-table-column prop="vbillno" label="运单号" min-width="180">
        <template slot-scope="scope">
          <router-link :to="'/operationCenter/way-bill/'+scope.row.vbillno" class="link-type">
            <span>{{ scope.row.vbillno }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="invoice_vbillno" label="订单号" min-width="180"/>
      <el-table-column prop="carr_name" label="承运商" min-width="180"/>
      <el-table-column prop="driver_name" label="司机" min-width="150"/>
      <el-table-column prop="carno" label="车牌号" min-width="150"/>
      <el-table-column prop="deli_addr" label="提货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="arri_addr" label="卸货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="pk_delivery" label="提货方" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="pk_trans_type" label="运输方式" min-width="150"/>
      <el-table-column prop="goods_name" label="货物名称" min-width="120" show-overflow-tooltip/>
      <el-table-column prop="num_count" label="总件数" min-width="120"/>
      <el-table-column prop="weight_count" label="总重量(t)" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeFixed(scope.row.weight_count) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="volume_count" label="总体积(m³)" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeFixed(scope.row.volume_count) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="委托日期" min-width="180"/>
      <el-table-column prop="create_user" label="录入人" min-width="150"/>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <router-link v-if="checkPermission(['tms.waybill.doing.attrack'])" :to="'/operationCenter/track/'+scope.row.vbillno" class="link-type">
            <el-button type="text">跟踪</el-button>
          </router-link>
          <!-- <router-link :to="'/way-bill/'+scope.row.vbillno" class="link-type"> -->
          <span v-if="checkPermission(['tms.waybill.doing.attrack'])" style="font-size:16px;">|</span>
          <span v-if="checkPermission(['tms.waybill.cost'])" class="link-type" @click="costDetail(scope.row.vbillno)">费用</span>
          <!-- </router-link> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="page-operation-bottons">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" style="float:right;margin-top:0;background-color: #f5f8fd;" @pagination="getList" />
    </div>

    <cost-info ref="costinfo" :show.sync="dialogFormVisible" :onselect="selectCostInfo" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { findEntrustList, findAbnormalEventByVbillno } from '@/api/entrust'
import waves from '@/directive/waves' // Waves directive
import EnumType from '@/constants/enumType'
import CostInfo from '@/components/CostInfo'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'UnderWayList',
  components: { Pagination, CostInfo },
  directives: { waves },
  filters: {
    entrustStateFilter(type) {
      return EnumType.entrustStateKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        userCode: '15111111112',
        optionType: '2',
        vbillno: '',
        entrustState: '',
        goodsName: '',
        invoiceVbillno: '',
        deliAddr: '',
        arriAddr: '',
        transportType: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      },
      entrustStateOptions: EnumType.entrustStatesUnderWay,
      isCriteriaMore: false,
      innerHeight: document.body.innerHeight,
      dialogFormVisible: false,
      expList: [],
      lookMoreExp: false
    }
  },
  computed: {
    tableHeight() {
      return innerHeight - 410
    }
  },
  watch: {
    innerHeight(val) {
      if (!this.timer) {
        this.innerHeight = val
        this.timer = true
        const that = this
        setTimeout(function() {
          that.init()
          that.timer = false
        }, 400)
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.innerHeight = window.screenHeight
      })()
    }
  },
  methods: {
    checkPermission,
    getList() {
      if (this.listQuery.startTime && this.listQuery.endTime) {
        if (this.listQuery.startTime > this.listQuery.endTime) {
          this.$message({
            type: 'warning',
            message: '开始日期不能超过结束日期!'
          })
          return false
        }
      }
      this.listLoading = true
      findEntrustList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.totalRecords || 0
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    showList() {
      this.lookMoreExp = false
    },
    resetForm() {
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.listQuery.vbillno = ''
      this.listQuery.entrustState = ''
      this.listQuery.goodsName = ''
      this.listQuery.invoiceVbillno = ''
      this.listQuery.deliAddr = ''
      this.listQuery.arriAddr = ''
      this.getList()
    },
    selectCostInfo() {

    },
    costDetail(data) {
      this.$refs.costinfo.getCostInfo(data)
      this.$nextTick(() => {
        this.dialogFormVisible = true
      })
    },
    expFlag(item) {
      const data = {
        userCode: '15111111112',
        vbillno: item
      }
      findAbnormalEventByVbillno(data).then(response => {
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
<!--<style>
  .el-popover {
     background: transparent!important;
     border: none!important;
     box-shadow:none!important;
  }
</style>-->
<style scoped>
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
