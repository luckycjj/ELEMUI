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
          <el-input v-model="listQuery.invoice_vbillno" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.deli_address" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.entrust_vbillno" placeholder="运单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.check_vbillno" placeholder="对帐号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column prop="invoice_vbillno" label="订单号" min-width="160">
        <template slot-scope="scope">
          <router-link :to="'/ordercenter/order-details/'+scope.row.invoice_vbillno" class="link-type">
            <span>{{ scope.row.invoice_vbillno }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="check_vbillno" label="对帐号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#409EFF" @click="addDialog(scope.row.check_vbillno)">{{ scope.row.check_vbillno }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pk_customer" label="委托客户" min-width="120"/>
      <el-table-column prop="bala_customer" label="结算客户" min-width="120"/>
      <el-table-column prop="entrust_vbillno" label="运单号" min-width="170"/>
      <el-table-column prop="deli_address" label="提货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="num_count" label="件数" min-width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.num_count }}件</p>
        </template>
      </el-table-column>
      <el-table-column prop="weight_count" label="重量" min-width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.weight_count }}吨</p>
        </template>
      </el-table-column>
      <el-table-column prop="volume_count" label="体积" min-width="130">
        <template slot-scope="scope">
          <p>{{ scope.row.volume_count }}立方米</p>
        </template>
      </el-table-column>
      <el-table-column prop="exp_type" label="费目" min-width="100"/>
      <el-table-column prop="create_time" label="创建时间" min-width="160"/>
      <el-table-column prop="create_user" label="创建人" min-width="120"/>
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
      <el-table-column prop="podTime" label="签收日期" min-width="170"/>
      <el-table-column prop="originType" label="来源" min-width="80"/>
    </el-table>
    <invoice ref="invoice" :show.sync="dialogFormVisible" :opinion.sync="invoiceInfo"/>
    <soa-dialog ref="soa" :sourcenumber = "source"/>
    <div class="page-operation-bottons">
      <el-row>
        <el-button class="port-btn" icon="el-icon-download" @click="exportList">导出</el-button>
        <el-button type="primary" icon="fa fa-print" @click="addInvocie"> 录入发票号</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" class="page-style" @pagination="getList" />
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import EnumType from '@/constants/enumType'
import { checkPayList, choosepkbala, lookCheck } from '@/api/settlement'
import waves from '@/directive/waves' // Waves directive
import invoice from '@/components/Invoice'
import SoaDialog from './AccountStatement'
import { fixedList } from '@/utils/fixedNum'
export default {
  name: 'PayUnbilled',
  components: { Pagination, invoice, SoaDialog },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      numTotal: 0,
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
        type: 2, // 1未对账、2未开票、3未核销、4已核销、5全部
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
      options: [],
      isCriteriaMore: false,
      dialogFormVisible: false,
      invoiceInfo: null,
      source: 1,
      multipleSelection: [],
      statusOptions: [
        {
          value: '新建',
          label: '新建'
        }, {
          value: '已确认',
          label: '已确认'
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
    exportList() {
      if (this.startendTime !== '') {
        this.listQuery.startTime = this.startendTime[0]
        this.listQuery.entTime = this.startendTime[1]
      }
      var arrayString = ''
      var x
      for (x in this.listQuery) {
        arrayString += '&' + x + '=' + this.listQuery[x]
      }
      window.location.href = 'http://www.xsungroup.cn:8089/tms/public/httpEdi/poi/exportPayFeeInfo.do?' + arrayString.substring(1)
    },
    addDialog(number) {
      var _this = this
      lookCheck({
        check_vbillno: number,
        userCode: '15001962939'
      }).then(response => {
        var costList = response.data.data.backFeeDtoList.map(function(item) {
          return item.cost_amount
        })
        var costMax = 0
        for (var i = 0; i < costList.length; i++) {
          costMax = _this.numAdd(costMax, costList[i] * 1)
        }
        _this.$refs.soa.postForm = {
          vbillno: response.data.data.check_vbillno, // 对帐号
          vbillnoType: '付', // 收付
          userCode: '15001962939',
          create_user: '15001962939', // 创建人
          vbillstatus: '0', // 订单状态
          pk_carrier: response.data.data.bala_customer, // 结算客户
          ent_customer: response.data.data.pk_customer, // 委托客户
          cost_amount: costMax,
          pk: '',
          month: response.data.data.account_period // 月份
        }
        _this.$refs.soa.list = response.data.data.backFeeDtoList
        _this.$refs.soa.type = 2
        _this.$refs.soa.dialogFormVisible = true
      })
    },
    numAdd(num1, num2) {
      // 加法精度
      var baseNum, baseNum1, baseNum2
      var precision// 精度
      try {
        baseNum1 = num1.toString().split('.')[1].length
      } catch (e) {
        baseNum1 = 0
      }
      try {
        baseNum2 = num2.toString().split('.')[1].length
      } catch (e) {
        baseNum2 = 0
      }
      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
      precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2
      return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision)
    },
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
      checkPayList(this.listQuery).then(response => {
        this.list = response.data.records

        this.total = response.data.totalCount || 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 生成开票
    addInvocie() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请先勾选需开票的条目!'
        })
        return false
      }
      var list = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (list.indexOf(this.multipleSelection[i].check_vbillno) === -1) {
          list.push(this.multipleSelection[i].check_vbillno)
        }
      }
      // if (list.length > 1 || list === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请勾选相同对账单条目!'
      //   })
      //   return false
      // }
      const pk_list = this.multipleSelection.map(item => item.pk_fee)
      const vbillno = this.multipleSelection.map(item => item.invoice_vbillno)
      var list2 = []
      for (var a = 0; a < vbillno.length; a++) {
        if (list2.indexOf(vbillno[a]) === -1) {
          list2.push(vbillno[a])
        }
      }
      this.invoiceInfo = {
        pk_list: pk_list,
        vbillno: list2,
        price: this.numTotal
      }
      this.$refs.invoice.invoiceForm.fee_type = 2
      // this.$router.push({ name: 'CreateInvoice', params: { pk_list: pk_list, vbillno: vbillno }})
      this.dialogFormVisible = true
    },
    resetForm() {
      this.listQuery.pk_customer = ''
      this.listQuery.bala_customer = ''
      this.listQuery.startTime = ''
      this.listQuery.entTime = ''
      this.startendTime = ''
      this.listQuery.invoice_vbillno = ''
      this.listQuery.deli_address = ''
      this.listQuery.entrust_vbillno = ''
      this.listQuery.check_vbillno = ''
      this.listQuery.bala_type = ''
      this.listQuery.pay_type = ''
      this.listQuery.origin_type = ''
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
        if (index !== 13 && index !== 14 && index !== 15) {
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
          if (index === 13 || index === 14 || index === 15) {
            sums[index] = sums[index].toFixed(2)
          }
          sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}

</script>

