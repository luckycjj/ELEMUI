<template>
  <div>
    <div class="filter-container">
      <el-select v-model="listQuery.pk_customer" placeholder="委托客户" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in entCustomerList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="listQuery.bala_customer" placeholder="结算客户" filterable clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in entCustomerList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.startTime"
        type="date"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="签收开始日期"/>
      <el-date-picker
        v-model="listQuery.entTime"
        type="date"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="签收结束日期"/>
      <el-select v-model="listQuery.vbillstatus" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
      <el-collapse-transition>
        <div v-show="isCriteriaMore">

          <el-input v-model="listQuery.invoice_vbillno" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.deli_address" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-select v-model="listQuery.origin_type" placeholder="来源" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in platform" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <el-select v-model="listQuery.bala_type" placeholder="结算方式" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in balatypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <el-select v-model="listQuery.pay_type" placeholder="支付方式" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in payOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <el-input v-model="listQuery.entrust_vbillno" placeholder="运单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        </div>
      </el-collapse-transition>
    </div>
    <div style="line-height:30px">已选金额总计：RMB  {{ numTotal }}元</div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :max-height="tableHeight"
      :summary-method="getSummaries"
      border
      fit
      highlight-current-row
      tooltip-effect="light"
      show-summary
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="vbillstatus" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.vbillstatus=='未确认'" class="font-red">{{
          scope.row.vbillstatus }}</span>
          <span v-else>{{ scope.row.vbillstatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="exp_type" label="费目" min-width="120"/>
      <el-table-column prop="pk_customer" label="委托客户" min-width="150"/>
      <el-table-column prop="bala_customer" label="结算客户" min-width="150"/>
      <el-table-column prop="invoice_vbillno" label="订单号" min-width="180"/>
      <el-table-column prop="entrust_vbillno" label="运单号" min-width="180">
        <template slot-scope="scope">
          <router-link :to="'/settlementCenter/way-bill/'+scope.row.entrust_vbillno" class="link-type">
            <span>{{ scope.row.entrust_vbillno }}</span>
          </router-link>
          <!-- <span class="link-type" @click="openWindow('#/way-bill/'+scope.row.entrust_vbillno,'运单详情')">{{ scope.row.entrust_vbillno }}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="deli_address" label="提货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="cost_amount" label="总额" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeItem(scope.row.cost_amount) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="got_amount" label="已核销金额" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeItem(scope.row.got_amount) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ungot_amount" label="待核销金额" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeItem(scope.row.ungot_amount) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bala_type" label="结算方式" min-width="120"/>
      <el-table-column prop="pay_type" label="支付方式" min-width="120"/>
      <el-table-column prop="create_user" label="创建人" min-width="120"/>
      <el-table-column prop="create_time" label="创建时间" min-width="170"/>
      <el-table-column prop="modify_user" label="更新人" min-width="120"/>
      <el-table-column prop="modify_time" label="更新时间" min-width="170"/>
      <el-table-column prop="podTime" label="签收日期" min-width="170"/>
      <el-table-column prop="originType" label="来源" min-width="80"/>
      <!-- <el-table-column fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <router-link :to="'/orderCenter/edit-order/'+scope.row.vbillno" class="link-type">
            <span>编辑发票</span>
          </router-link>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- <invoice :show.sync="dialogFormVisible" :onselect="selectInvoice"/> -->
    <div class="page-operation-bottons">
      <el-row>
        <el-button v-if="checkPermission(['tms.settlement.costlist.ensure'])" :disabled="costState" class="confrim-btn" icon="el-icon-success" @click="confirmCost">费用确认</el-button>
        <el-button v-if="checkPermission(['tms.settlement.costlist.unlock'])" class="change-btn" icon="el-icon-success" @click="cancelCost">解锁</el-button>
        <!-- <el-button type="primary" icon="el-icon-success" >录入开票号</el-button> -->
        <!-- <el-button type="primary" icon="el-icon-download">导出</el-button> -->
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" style="float:right;margin-top:0;background-color: #f5f8fd;" @pagination="getList"/>
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import EnumType from '@/constants/enumType'
import { feeList, feeConfirm, feeUnConfirm } from '@/api/settlement'
import waves from '@/directive/waves' // Waves directive
import EnumType from '@/constants/enumType'
import Invoice from '@/components/Invoice'
import { getEntCustomer } from '@/api/order'
import checkPermission from '@/utils/permission' // 权限判断函数
import openWindow from '@/utils/openWindow'
import { fixedList } from '@/utils/fixedNum'
export default {
  name: 'PayableCost',
  components: { Pagination, Invoice },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        fee_type: 2,
        pk_customer: '',
        bala_customer: '',
        bala_type: '',
        invoice_vbillno: '',
        deli_address: '',
        vbillstatus: '',
        origin_type: '',
        pay_type: '',
        startTime: '',
        entTime: '',
        pageSize: 10,
        pageNum: 1,
        entrust_vbillno: '',
        userCode: '15111111112'
      },
      isCriteriaMore: false,
      multipleSelection: [],
      statusOptions: EnumType.costStates,
      balatypeOptions: EnumType.balatypeStates,
      payOptions: EnumType.paymentStates,
      platform: [{
        value: '1',
        label: 'APP'
      }, {
        value: '2',
        label: 'PC'
      }],
      dialogFormVisible: false,
      costState: false,
      numTotal: 0,
      entCustomerList: []
    }
  },
  computed: {
    tableHeight() {
      return innerHeight - 425
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
    this.getEntCustomerList()
  },
  methods: {
    openWindow,
    checkPermission,
    changeItem(item) {
      return fixedList.fiexedTwoNum(item)
    },
    // 获取委托客户列表
    getEntCustomerList() {
      const data = {
        type: '2'
      }
      this.entCustomerList = []
      getEntCustomer(data).then(response => {
        this.entCustomerList = response.data.datas.map(item => {
          return { value: item.pk_customer, label: item.cust_name }
        })
      })
    },
    // 勾选条目
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val
      this.numTotal = 0
      if (this.multipleSelection.length <= 0) {
        this.costState = false
      }
      for (var data of this.multipleSelection) {
        this.numTotal += data.cost_amount
      }
      this.numTotal = this.numTotal.toFixed(2)
      for (var item of this.multipleSelection) {
        if (item.vbillstatus !== '未确认') {
          this.costState = true
          break
        } else {
          this.costState = false
        }
      }
    },
    // 获取列表信息
    getList() {
      // console.log(this.listQuery)
      this.listLoading = true
      feeList(this.listQuery).then(response => {
        // console.log(response.data)
        this.list = response.data.records
        this.total = response.data.totalCount || 0

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    // 过滤
    handleFilter() {
      if (this.listQuery.startTime && this.listQuery.entTime) {
        if (this.listQuery.startTime > this.listQuery.entTime) {
          this.$message({
            type: 'warning',
            message: '开始日期不能超过结束日期!'
          })
          return false
        }
      }
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 表格合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index !== 8 && index !== 9 && index !== 10) {
          sums[index] = ''
          return
        }

        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (index === 8 || index === 9 || index === 10) {
            sums[index] = sums[index].toFixed(2)
          }
          sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    // 确认费用
    confirmCost() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请先勾选所需条目!'
        })
        return false
      }
      this.$confirm('此操作将确认该记录, 是否确认?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const list = this.multipleSelection.map(item => item.pk_fee)
        feeConfirm(list).then(response => {
        // console.log(response.data)
          if (response.data.success || response.data === true) {
            this.multipleSelection.forEach((item, index, arr) => {
              item.vbillstatus = '已确认'
            })
            this.$message({
              type: 'success',
              message: '确认成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg + ',确认失败!'
            })
          }
        })
      })
    },
    // 解锁费用
    cancelCost() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请先勾选所需条目!'
        })
        return false
      }
      for (var item of this.multipleSelection) {
        if (item.vbillstatus !== '已确认') {
          this.$message({
            type: 'warning',
            message: '已确认的费用才能解锁!'
          })
          return false
        }
      }
      this.$confirm('该操作将解锁该记录，是否解锁?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const list = this.multipleSelection.map(item => item.pk_fee)
        feeUnConfirm(list).then(response => {
          // console.log(response.data)
          if (response.data.success || response.data === true) {
            this.multipleSelection.forEach((item, index, arr) => {
              item.vbillstatus = '未确认'
            })
            this.costState = false
            this.$message({
              type: 'success',
              message: '解锁成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg + ',确认失败!'
            })
          }
        })
      })
    },
    selectInvoice(selection) {

    },
    // 重置搜索项
    resetForm() {
      this.listQuery = {
        fee_type: 2,
        pk_customer: '',
        bala_customer: '',
        bala_type: '',
        invoice_vbillno: '',
        deli_address: '',
        vbillstatus: '',
        origin_type: '',
        pay_type: '',
        startTime: '',
        entTime: '',
        pageSize: 10,
        pageNum: 1,
        entrust_vbillno: '',
        userCode: '15111111112'
      }
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.note.note-info {
    background-color: #f5f8fd;
    border-color: #8bb4e7;
    color: #010407;
    }
.note {
    margin: 0 0 20px;
    padding: 15px 30px 15px 15px;
    border-left: 5px solid #eee;
    border-radius: 0 4px 4px 0;
}
</style>
