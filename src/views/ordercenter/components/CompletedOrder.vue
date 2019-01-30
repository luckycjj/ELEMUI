
<template>
  <div>
    <div class="filter-container">
      <el-input v-model.trim="listQuery.vbillno" placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model.trim="listQuery.custOrderno" placeholder="客户编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.vbillstatus" placeholder="订单状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in vbillstatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.startTime"
        type="date"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="下单开始日期"/>
      <el-date-picker
        v-model="listQuery.endTime"
        type="date"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="下单结束日期"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
      <el-collapse-transition>
        <div v-show="isCriteriaMore">
          <el-input v-model.trim="listQuery.goods_name" placeholder="货物名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-select v-model="listQuery.pk_trans_type" placeholder="运输方式" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in pk_trans_typeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <el-input v-model.trim="listQuery.delivery" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model.trim="listQuery.arrival" placeholder="卸货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column prop="vbillstatus" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.vbillstatus=='已确认'" class="font-green">{{
          scope.row.vbillstatus }}</span>
          <span v-else>{{ scope.row.vbillstatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="vbillno" label="订单编号" min-width="180"/>
      <!-- <el-table-column prop="vbillno" label="订单编号" min-width="160">
        <template slot-scope="scope">
          <router-link :to="'/ordercenter/order-details/'+scope.row.vbillno" class="link-type">
            <span>{{ scope.row.vbillno }}</span>
          </router-link>
        </template>
      </el-table-column> -->
      <el-table-column prop="custOrderno" label="客户编号" min-width="120"/>
      <el-table-column prop="pk_trans_type" label="运输方式" min-width="120"/>
      <el-table-column prop="ent_date" label="下单日期" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.ent_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deli_address" label="提货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="arri_address" label="卸货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="carr_name" label="承运商" min-width="180"/>
      <el-table-column prop="goods_name" label="货物名称" min-width="120" show-overflow-tooltip/>
      <el-table-column prop="num" label="总件数" min-width="120"/>
      <el-table-column prop="weight" label="总重量(t)" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeFixed(scope.row.weight) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="总体积(m³)" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeFixed(scope.row.volume) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <!-- <a href="editorder.html">编辑</a> -->
          <router-link v-if="checkPermission(['tms.order.detail'])" :to="'/ordercenter/order-details/'+scope.row.vbillno" class="link-type">
            <span>详情</span>
          </router-link>
          <span v-if="checkPermission(['tms.order.cost'])" style="font-size:16px;">|</span>
          <el-button v-if="checkPermission(['tms.order.cost'])" type="text" @click="editReceCost(scope.row.vbillno)">费用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-operation-bottons">
      <el-row>
        <!-- <el-button type="primary" icon="el-icon-upload2" >导入</el-button> -->
        <el-button v-if="checkPermission(['tms.order.finish.export'])" class="port-btn" icon="el-icon-download" @click="exportInvoice">导出</el-button>
        <el-button v-if="checkPermission(['tms.order.finish.exportReceipt'])" class="port-btn" icon="el-icon-download" @click="downloadZip">回单导出</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" style="float:right;margin-top:0;background-color: #f5f8fd;" @pagination="getList" />
      </el-row>
    </div>
    <rece-cost v-if="checkPermission(['tms.order.cost'])" ref="rececost" :show.sync="dialogFormVisible" :sourcenumber.sync="source" type="text"/>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getUserCode } from '@/utils/auth'
import { fetchList } from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import EnumType from '@/constants/enumType'
import UploadExcelComponent from './UploadExcel.vue'
import ReceCost from './ReceCost'
import { exportInvoice, downloadZip } from '@/api/poi'
import moment from 'moment'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'CompletedOrder',
  components: { Pagination, UploadExcelComponent, ReceCost },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        userCode: '',
        type: 3,
        vbillno: '',
        custOrderno: '',
        vbillstatus: '',
        goods_name: '',
        delivery: '',
        arrival: '',
        pk_trans_type: '',
        startTime: '',
        endTime: '',
        cust_deli_no: '',
        pageNum: 1,
        pageSize: 10
      },
      multipleSelection: [],
      isCriteriaMore: false,
      vbillstatusOptions: EnumType.vbillstatusCompOptions,
      pk_trans_typeOptions: EnumType.pk_trans_typeOptions,
      innerHeight: document.body.innerHeight,
      dialogFormVisible: false,
      source: 1
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
    this.listQuery.userCode = getUserCode()
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
        this.total = response.data.data.totalCount === undefined ? 0 : response.data.data.totalCount

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    exportInvoice() {
      exportInvoice(this.listQuery).then(response => {
        const fileName = '已完成订单' + moment(new Date()).format('YYYYMMDDhhmmss') + '.xls'
        // 获取文件名
        const objectUrl = URL.createObjectURL(new Blob([response.data], { type: response.headers['Content-Type'] }))
        // 文件地址
        const a = document.getElementById('download_a')
        a.href = objectUrl
        a.download = fileName
        a.click()
        URL.revokeObjectUrl(a.href)
      })
    },
    downloadZip() {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '操作失败！请选择数据！'
        })
        return
      }
      for (const item of this.multipleSelection) {
        if (item.vbillstatus === '已签收') {
          this.$message({
            type: 'warning',
            message: '已回单的订单才能导出！'
          })
          return
        }
        continue
      }

      const selectRowNos = []

      this.multipleSelection.forEach((item, index, arr) => {
        selectRowNos.push(item.vbillno)
      })
      downloadZip({ invoiceVbillno: selectRowNos.join() }).then(response => {
        const fileName = '回单' + moment(new Date()).format('YYYYMMDDhhmmss') + '.zip'
        // 获取文件名
        const objectUrl = URL.createObjectURL(new Blob([response.data], { type: response.headers['Content-Type'] }))
        // 文件地址
        const a = document.getElementById('download_a')
        a.href = objectUrl
        a.download = fileName
        a.click()
        URL.revokeObjectUrl(a.href)
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    resetForm() {
      this.listQuery.vbillno = ''
      this.listQuery.custOrderno = ''
      this.listQuery.vbillstatus = ''
      this.listQuery.goods_name = ''
      this.listQuery.pk_trans_type = ''
      this.listQuery.delivery = ''
      this.listQuery.arrival = ''
      this.getList()
    },
    editReceCost(item) {
      this.$refs.rececost.getCostInfo(item)
      this.$nextTick(() => {
        this.dialogFormVisible = true
      })
    },
    changeFixed(item) {
      if (item !== '' || item !== undefined || item !== null) {
        return item.toFixed(3)
      } else {
        return '0.000'
      }
    }
  }
}
</script>
