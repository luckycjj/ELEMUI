<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="待派单">
        <div class="filter-container">
          <el-date-picker
            v-model="listQuery.startTime"
            type="date"
            size="medium"
            style="width: 200px;"
            class="filter-item"
            value-format="yyyy-MM-dd"
            placeholder="托单开始日期"/>
          <el-date-picker
            v-model="listQuery.endTime"
            type="date"
            size="medium"
            style="width: 200px;"
            class="filter-item"
            value-format="yyyy-MM-dd"
            placeholder="托单结束日期"/>
          <el-input v-model="listQuery.segment_vbillno" placeholder="托单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.invoice_vbillno" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
          <el-collapse-transition>
            <div v-show="isCriteriaMore">
              <el-input v-model="listQuery.goods_name" placeholder="货物名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
              <el-input v-model="listQuery.delivery" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
              <el-input v-model="listQuery.arrival" placeholder="卸货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
          <el-table-column align="center" prop="priority" label="优先级" width="80">
            <template slot-scope="scope">
              <i v-if="scope.row.priority=='Y'" class="fa fa-bolt font-red font-lg"/>
              <i v-if="scope.row.priority=='N'" class="fa fa-bolt font-grey font-lg"/>
            </template>
          </el-table-column>
          <el-table-column prop="invoice_vbillno" label="订单编号" min-width="180"/>
          <el-table-column prop="segment_vbillno" label="托单编号" min-width="180"/>
          <el-table-column prop="bill_origin" label="来源" min-width="120"/>
          <el-table-column prop="pk_trans_type" label="运输方式" min-width="120"/>
          <el-table-column prop="delivery" label="提货地址" min-width="300" show-overflow-tooltip />
          <el-table-column prop="arrival" label="卸货地址" min-width="300" show-overflow-tooltip />
          <el-table-column prop="deli_time" label="提货日期" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.deli_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="arri_time" label="到货日期" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.arri_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
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
          <el-table-column prop="create_user" label="创建人" min-width="120"/>
          <el-table-column prop="create_time" label="托单日期" min-width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" min-width="60">
            <template slot-scope="scope">
              <!-- <a href="editorder.html">编辑</a> -->
              <!-- <el-button v-if="checkPermission(['tms.waybill.undo.selectCarriers'])" type="text" @click="openSelectCarrier(scope.row)">选择承运商</el-button> -->
              <el-tooltip v-if="checkPermission(['tms.waybill.undo.selectDrivers'])" class="item" effect="light" content="分配车辆司机" placement="top">
                <el-button type="text" @click="openSelectCarDriver(scope.row)"><img src="@../../../static/car/driver.png" ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <div class="page-operation-bottons">
          <el-row>
            <!-- <el-button class="change-btn" icon="el-icon-check" @click="batchOpenSelectCarrier">批量分配承运商</el-button> -->
            <el-button v-if="checkPermission(['tms.waybill.undo.selectDriverGPRS'])" class="change-btn" icon="el-icon-check">GPRS分配</el-button>
            <el-button v-if="checkPermission(['tms.waybill.undo.selectDrivers'])" class="change-btn" icon="el-icon-check" @click="batchOpenSelectCarDriver">批量分配司机</el-button>
            <!-- <el-button type="warning" icon="el-icon-refresh">撤销</el-button> -->
            <el-button v-if="checkPermission(['tms.waybill.undo.reject'])" class="cancel-btn" icon="el-icon-delete" @click="cancleSegment">作废订单</el-button>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" style="float:right;margin-top:0;background-color: #f5f8fd;" @pagination="getList" />
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <select-carrier v-if="checkPermission(['tms.waybill.undo.selectCarriers'])" :show.sync="dialogCarrierVisible" :onselect="selectCarrier"/>
    <select-car-driver v-if="checkPermission(['tms.waybill.undo.selectDrivers'])" ref="carDriver" :show.sync="dialogCarDriverVisible" :weight="selevtWeight" :onselect="selectCarDriver"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { fetchList, cancleSegment, selectCarrier, selectDriver } from '@/api/stow'
import waves from '@/directive/waves' // Waves directive
import SelectCarrier from '@/components/SelectCarrier'
import SelectCarDriver from '@/components/SelectCarDriver'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Dispatch',
  components: { Pagination, SelectCarrier, SelectCarDriver },
  directives: { waves },
  filters: {
    orderNoFilter(str) {
      return str
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        startTime: '',
        endTime: '',
        invoice_vbillno: '',
        segment_vbillno: '',
        contract_no: '',
        goods_name: '',
        delivery: '',
        arrival: '',
        userCode: '15111111112',
        pageNum: 1,
        pageSize: 10
      },
      selevtWeight: 0,
      multipleSelection: [],
      isCriteriaMore: false,
      dialogCarrierVisible: false,
      dialogCarDriverVisible: false,
      currentRow: null,
      isBatch: false,
      innerHeight: document.body.innerHeight
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
    if (this.$route.query.fhd) {
      this.listQuery.invoice_vbillno = this.$route.query.fhd
    }
    this.getList()
    // console.log(this.$route.query.fhd)
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
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.datas
        this.total = response.data.data.totalCount || 0

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    cancleSegment() {
      if (this.selectRowNos().length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要作废的订单!'
        })
        return
      }
      this.$confirm('此操作将作废该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var json = {
          segment_vbillno: this.selectRowNos().join(),
          userCode: '15111111112'
        }
        cancleSegment(json).then(response => {
          if (response.data.success) {
            this.multipleSelection.forEach((item, index, arr) => {
              const i = this.list.indexOf(item)
              this.list.splice(i, 1)
            })
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '操作失败!' + response.data.msg
            })
          }
        })
      })
    },
    openSelectCarrier(row) {
      this.dialogCarrierVisible = true
      this.currentRow = row
      this.isBatch = false
    },
    openSelectCarDriver(row) {
      this.dialogCarDriverVisible = true
      this.isBatch = false
      this.currentRow = row
      this.selevtWeight = row.weight_count
      this.$refs.carDriver.getCarList()
      this.$refs.carDriver.getDriverList()
    },
    batchOpenSelectCarrier() {
      this.isBatch = true
      if (this.selectRowNos().length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要分配承运商的订单!'
        })
        return
      }
      this.dialogCarrierVisible = true
    },
    batchOpenSelectCarDriver() {
      this.isBatch = true
      if (this.selectRowNos().length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要分配司机车辆的订单!'
        })
        return
      }
      this.multipleSelection.forEach((item, index, arr) => {
        this.selevtWeight += item.weight_count
      })
      this.dialogCarDriverVisible = true
    },
    selectCarrier(selection) {
      let segment_vbillno = ''
      if (this.isBatch) {
        segment_vbillno = this.selectRowNos().join()
      } else {
        segment_vbillno = this.currentRow.segment_vbillno
      }
      const postData = {
        userCode: '15111111112',
        segment_vbillno: segment_vbillno,
        pk_carrier: selection.pk_carrier
      }
      selectCarrier(postData).then(response => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'warning',
            message: '操作失败!' + response.data.msg
          })
        }
      })
      this.dialogFormVisible = false
    },
    selectCarDriver(selection) {
      let segment_vbillno = ''
      if (this.isBatch) {
        segment_vbillno = this.selectRowNos().join()
      } else {
        segment_vbillno = this.currentRow.segment_vbillno
      }
      var postData = null
      if (selection.car) {
        postData = {
          segment_vbillno: segment_vbillno,
          carno: selection.car.carno,
          driverCode: selection.driver.driver_code,
          driver_mobile: selection.driver.driver_mobile,
          driver_name: selection.driver.driver_name,
          userCode: '15111111112'
        }
      } else {
        postData = {
          segment_vbillno: segment_vbillno,
          carno: selection.carHead.carno,
          car_hang: selection.carHang.carno,
          driverCode: selection.driver.driver_code,
          driver_mobile: selection.driver.driver_mobile,
          driver_name: selection.driver.driver_name,
          userCode: '15111111112'
        }
      }

      selectDriver(postData).then(response => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
          this.$refs.carDriver.reload()
          this.dialogCarDriverVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: '操作失败!' + response.data.msg
          })
        }
      })
    },
    selectRowNos() {
      const selectRowNos = []
      this.multipleSelection.forEach((item, index, arr) => {
        selectRowNos.push(item.segment_vbillno)
      })
      return selectRowNos
    },
    resetForm() {
      this.listQuery.startTime = ''
      this.listQuery.endTime = ''
      this.listQuery.segment_vbillno = ''
      this.listQuery.invoice_vbillno = ''
      this.listQuery.goods_name = ''
      this.listQuery.delivery = ''
      this.listQuery.arrival = ''
      this.getList()
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
