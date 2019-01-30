
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
      style="width: 100%;"
      @selection-change="handleSelectionChange">
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
      <!-- <el-table-column prop="YCSJ" label="异常事件" width="80">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.YCSJ"
            placement="top"
            width="260"
            trigger="hover">
            <span>联系人：张三</span><br>
            <span>联系方式：182983748</span>
            <p>{{ scope.row.YCSJ }}</p>
            <i slot="reference" class="fa fa-warning font-red"/>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column prop="segment_vbillno" label="托单号" min-width="180"/>
      <el-table-column prop="vbillno" label="运单号" min-width="180">
        <template slot-scope="scope">
          <router-link :to="'/operationCenter/way-bill/'+scope.row.vbillno" class="link-type">
            <span>{{ scope.row.vbillno }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="invoice_vbillno" label="订单号" min-width="180"/>
      <el-table-column prop="pk_trans_type" label="运输方式" min-width="150"/>
      <el-table-column prop="carr_name" label="承运商" min-width="180"/>
      <el-table-column prop="driver_name" label="司机" min-width="150"/>
      <el-table-column prop="carno" label="车牌号" min-width="150"/>
      <el-table-column prop="deli_addr" label="提货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="arri_addr" label="卸货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="pk_delivery" label="提货方" min-width="150" show-overflow-tooltip/>
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
      <el-table-column fixed="right" label="操作" min-width="90">
        <template slot-scope="scope">
          <!-- <router-link :to="'/way-bill/'+scope.row.vbillno" class="link-type"> -->
          <el-button v-if="checkPermission(['tms.waybill.cost'])" type="text" @click="costDetail(scope.row.vbillno)">费用详情</el-button>
          <!-- </router-link> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="page-operation-bottons">
      <el-row>
        <el-button v-if="checkPermission(['tms.waybill.done.redistribution'])" class="change-btn" icon="el-icon-sort" @click="handleRedistribution">改配</el-button>
        <el-button v-if="checkPermission(['tms.waybill.done.revoke'])" class="cancel-btn" icon="el-icon-delete" @click="handleUnModifyMatch">撤销</el-button>
        <el-button v-if="checkPermission(['tms.waybill.done.export'])" class="port-btn" icon="el-icon-download" @click="exportEntrust">导出</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" style="float:right;margin-top:0;background-color: #f5f8fd;" @pagination="getList" />
      </el-row>
    </div>
    <select-car-driver v-if="checkPermission(['tms.waybill.done.redistribution'])" ref="carDriver1" :show.sync="dialogCarDriverVisible" :weight="selevtWeight" :onselect="selectCarDriver"/>
    <cost-info v-if="checkPermission(['tms.waybill.cost'])" ref="costinfo" :show.sync="dialogFormVisible" :onselect="selectCostInfo" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SelectCarDriver from '@/components/SelectCarDriver'
import { findEntrustList, unModifyMatch, modifyMatch } from '@/api/entrust'
import waves from '@/directive/waves' // Waves directive
import EnumType from '@/constants/enumType'
import CostInfo from '@/components/CostInfo'
import { exportEntrust } from '@/api/poi'
import moment from 'moment'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'SentList',
  components: { Pagination, SelectCarDriver, CostInfo },
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
        optionType: '1',
        vbillno: '',
        entrustState: '',
        invoiceVbillno: '',
        goodsName: '',
        deliAddr: '',
        arriAddr: '',
        transportType: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      },
      selevtWeight: 0,
      isCriteriaMore: false,
      entrustStateOptions: EnumType.entrustStatesSend,
      dialogCarDriverVisible: false,
      multipleSelection: [],
      innerHeight: document.body.innerHeight,
      dialogFormVisible: false
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
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  methods: {
    checkPermission,
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      debugger
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
    handleRedistribution() {
      if (this.multipleSelection.length > 0) {
        this.selevtWeight = this.multipleSelection[0].weight_count
        this.dialogCarDriverVisible = true
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择数据！'
        })
      }
    },
    handleUnModifyMatch() {
      this.$confirm('此操作将撤销改配司机车辆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const postJson = {
          userCode: '15111111112',
          entrustVbillno: this.selectRowNos().join()
        }
        unModifyMatch(postJson).then(response => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '撤销成功！'
            })
            this.getList()
          } else {
            this.$message({
              type: 'warning',
              message: '撤销失败！' + response.data.msg
            })
          }
        })
      })
    },
    selectCarDriver(selection) {
      var postData = null
      if (selection.car) {
        postData = {
          entrustVbillno: this.selectRowNos().join(),
          carno: selection.car.carno,
          driverMobile: selection.driver.driver_mobile,
          userCode: '15111111112'
        }
      } else {
        postData = {
          entrustVbillno: this.selectRowNos().join(),
          carno: selection.carHead.carno,
          car_hang: selection.carHang.carno,
          driverMobile: selection.driver.driver_mobile,
          userCode: '15111111112'
        }
      }

      modifyMatch(postData).then(response => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
          this.$refs.carDriver1.reload()
          this.dialogCarDriverVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: '操作失败!' + response.data.msg
          })
        }
      })
    },
    exportEntrust() {
      exportEntrust(this.listQuery).then(response => {
        debugger
        const fileName = '已派单运单' + moment(new Date()).format('YYYYMMDDhhmmss') + '.xls'
        // 获取文件名
        const objectUrl = URL.createObjectURL(new Blob([response.data], { type: response.headers['Content-Type'] }))
        // 文件地址
        const a = document.getElementById('download_a')
        a.href = objectUrl
        a.download = fileName
        a.click()
        URL.revokeObjectUrl(a.href)
      // this.download(response.data)
      })
      // exportInvoice(this.listQuery).then(response => {
      //   debugger
      //   this.download(response.data)
      // })
    },
    selectRowNos() {
      const selectRowNos = []
      this.multipleSelection.forEach((item, index, arr) => {
        selectRowNos.push(item.vbillno)
      })
      return selectRowNos
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

