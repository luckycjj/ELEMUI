<template>
  <div>
    <div class="filter-container">
      <el-select v-model="listQuery.pk_customer" clearable class="filter-item" placeholder="委托客户" style="width: 200px;">
        <el-option
          v-for="item in pk_customerList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.bala_customer" clearable class="filter-item" placeholder="结算客户" style="width: 200px;">
        <el-option
          v-for="item in bala_customerList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-date-picker
        v-model="startendTime"
        type="datetimerange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        class="filter-item"
        style="width:400px;"
        range-separator="-"
        start-placeholder="签收开始日期"
        end-placeholder="签收结束日期"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
      <el-collapse-transition>
        <div v-show="isCriteriaMore">
          <el-input v-model="listQuery.invoice_vbillno" placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.deli_address" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <div class="clearBoth"/>
          <el-select v-model="listQuery.bala_type" clearable placeholder="请选择结算方式" style="width: 200px;">
            <el-option
              v-for="item in bala_typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-model="listQuery.pay_type" clearable placeholder="请选择支付方式" style="width: 200px;">
            <el-option
              v-for="item in pay_typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-model="listQuery.origin_type" clearable placeholder="请选择来源" style="width: 200px;">
            <el-option
              v-for="item in origin_typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
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
      show-summary
      tooltip-effect="light"
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <!-- <el-table-column prop="bill_vbillno" label="发票号" min-width="120"/>-->
      <!--   <el-table-column prop="check_vbillno" label="对帐号" min-width="100"/>-->
      <el-table-column prop="exp_type" label="费目" min-width="100"/>
      <el-table-column prop="pk_customer" label="委托客户" min-width="120"/>
      <el-table-column prop="bala_customer" label="结算客户" min-width="120"/>
      <el-table-column prop="invoice_vbillno" label="订单编号" min-width="160">
        <template slot-scope="scope">
          <router-link :to="'/ordercenter/order-details/' + scope.row.invoice_vbillno" class="link-type">
            <span>{{ scope.row.invoice_vbillno }}</span>
          </router-link>
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
      <el-table-column prop="create_user" label="创建人" min-width="120"/>
      <el-table-column prop="create_time" label="创建时间" min-width="160"/>
      <el-table-column prop="bala_type" label="结算方式" min-width="80"/>
      <el-table-column prop="pay_type" label="支付方式" min-width="80"/>
      <el-table-column prop="modify_user" label="更新人" min-width="100"/>
      <el-table-column prop="modify_time" label="更新时间" min-width="160"/>
      <el-table-column prop="podTime" label="签收日期" min-width="170"/>
      <el-table-column prop="originType" label="来源" min-width="80"/>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
    <soa-dialog ref="soa" :sourcenumber = "source"/>
    <div class="page-operation-bottons">
      <el-row>
        <el-button v-if="checkPermission(['tms.settlement.collect.create']) || checkPermission(['tms.settlement.pay.create'])" class="change-btn" icon="el-icon-plus" @click="addDialog">新增对账单</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" class="page-style" @pagination="getList"/>
      <!--  <el-button type="primary" icon="el-icon-download">导出</el-button>
        <el-button type="primary" icon="fa fa-print"> 生成电子发票</el-button>-->
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SoaDialog from './AccountStatement'
// import EnumType from '@/constants/enumType'
import { checkList, choosepkbala } from '@/api/settlement'
import waves from '@/directive/waves' // Waves directive
import checkPermission from '@/utils/permission' // 权限判断函数
import { fixedList } from '@/utils/fixedNum'
export default {
  name: 'RecNoaccount',
  components: { Pagination, SoaDialog },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      numTotal: 0,
      source: 0,
      pk_customerList: [],
      bala_customerList: [],
      bala_typeList: [{
        value: 0,
        label: '月结'
      }, {
        value: 1,
        label: '现结'
      }],
      pay_typeList: [{
        value: 1,
        label: '电汇'
      }, {
        value: 2,
        label: '现金'
      }, {
        value: 3,
        label: '支票'
      }],
      origin_typeList: [{
        value: 1,
        label: 'APP'
      }, {
        value: 2,
        label: 'PC'
      }],
      list: null,
      total: 0,
      listLoading: false,
      startendTime: '',
      listQuery: {
        userCode: '15001962939', // 用户编码
        type: 1, // 1未对账、2未开票、3未核销、4已核销、5全部
        account_period: '', // 账期
        check_vbillno: '',
        bala_customer: '', // 结算单位
        bala_type: '', // 结算方式
        pay_type: '', // 支付方式（1电汇、2现金、3支票、4代收、5代付）
        deli_address: '', // 提货地址
        startTime: '', // 这两个时间是发货单的签收时间(很奇怪)
        entTime: '',
        origin_type: '', // 来源（1：APP、2：PC）
        bill_vbillno: '', // 发票号
        vbillstatus: '', // 0未确认、1已确认、2已对账、3已开票、4已核销
        invoice_vbillno: '', // 订单号
        entrust_vbillno: '', // 运单号
        pageNum: 1,
        pageSize: 10,
        cost_amount: '',
        pk_customer: ''// 委托单位
      },
      isCriteriaMore: false,
      multipleSelection: [],
      statusOptions: [
        {
          value: '未确认',
          label: '未确认'
        }, {
          value: '已确认',
          label: '已确认'
        }, {
          value: '全部',
          label: '全部'
        }
      ]
    }
  },
  computed: {
    tableHeight() {
      return innerHeight - 430
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
    choosepkbala({
      'type': 2
    }).then(response => {
      // console.log(response)
      var _data = response.data.datas
      for (var i = 0; i < _data.length; i++) {
        var json = {
          value: _data[i].pk_customer,
          label: _data[i].cust_name
        }
        this.pk_customerList.push(json)
        this.bala_customerList.push(json)
      }
    })
  },
  methods: {
    changeItem(item) {
      return fixedList.fiexedTwoNum(item)
    },
    checkPermission,
    handleSelectionChange(val) {
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
    getList() {
      this.listLoading = true
      if (this.startendTime !== '') {
        this.listQuery.startTime = this.startendTime[0]
        this.listQuery.entTime = this.startendTime[1]
      }
      checkList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.data.records

        this.total = response.data.totalCount || 0

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
    /*  console.log(this.listQuery);*/
      this.listQuery.pageNum = 1
      this.getList()
    },
    addDialog() {
      var _this = this
      if (_this.multipleSelection.length === 0) {
        _this.$message({
          type: 'warning',
          message: '请勾选相关账单!'
        })
        return false
      }
      if (!_this.selectArr(_this.multipleSelection)) {
        _this.$message({
          type: 'warning',
          message: '请勾选相同委托客户,结算客户,结算方式的账单!'
        })
        return false
      }
      const pk = []
      for (var i = 0; i < _this.multipleSelection.length; i++) {
        pk.push(_this.multipleSelection[i].pk_fee)
      }
      _this.$refs.soa.postForm = {
        vbillno: '', // 对帐号
        vbillnoType: '收', // 收付
        userCode: '15001962939',
        create_user: '15001962939', // 创建人
        vbillstatus: '0', // 订单状态
        pk_carrier: _this.multipleSelection[0].bala_customer, // 结算客户
        ent_customer: _this.multipleSelection[0].pk_customer, // 委托客户
        cost_amount: _this.numTotal,
        pk: pk,
        month: this.getDateInfo() // 月份
      }
      _this.$refs.soa.list = _this.multipleSelection.concat()
      _this.$refs.soa.type = 0
      _this.$refs.soa.dialogFormVisible = true
    },
    selectArr(arr) {
      var _this = this
      const arrContact = arr.concat()
      var bala_customerList = []
      var pk_customerList = []
      var bala_typeList = []
      for (var i = 0; i < arrContact.length; i++) {
        bala_customerList.push(arrContact[i].bala_customer)
        pk_customerList.push(arrContact[i].pk_customer)
        bala_typeList.push(arrContact[i].bala_type)
      }
      bala_customerList = _this.unique(bala_customerList)
      pk_customerList = _this.unique(pk_customerList)
      bala_typeList = _this.unique(bala_typeList)
      if (bala_customerList.length > 1 || pk_customerList.length > 1 || bala_typeList.length > 1) {
        return false
      }
      return true
    },
    unique(arr) {
      var newArr = []
      for (var i in arr) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i])
        }
      }
      return newArr
    },
    resetForm() {
      this.listQuery.pk_customer = ''
      this.listQuery.bala_customer = ''
      this.listQuery.startTime = ''
      this.listQuery.entTime = ''
      this.startendTime = ''
      this.listQuery.invoice_vbillno = ''
      this.listQuery.deli_address = ''
      this.listQuery.bala_type = ''
      this.listQuery.check_vbillno = ''
      this.listQuery.origin_type = ''
      this.listQuery.pay_type = ''
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
        if (index !== 6 && index !== 7 && index !== 8) {
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
          if (index === 6 || index === 7 || index === 8) {
            sums[index] = sums[index].toFixed(2)
          }
          sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    getDateInfo() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = (month < 10 ? '0' + month : month)
      console.log(year + '-' + month)
      return year + '-' + month
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
  .clearBoth{
    clear:both;
  }
</style>

