<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.bill_vbillno" placeholder="发票号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.head" placeholder="发票抬头" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.memo" placeholder="费目" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
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
      <el-table-column prop="bill_vbillno" label="发票号" min-width="120"/>
      <el-table-column prop="head" label="发票抬头" min-width="150"/>
      <el-table-column prop="memo" label="费目" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="cost_amount" label="金额" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeItem(scope.row.cost_amount) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_user" label="创建人" min-width="100"/>
      <el-table-column prop="create_time" label="创建时间" min-width="160"/>
      <!-- <el-table-column prop="modify_user" label="更新人" min-width="100"/> -->
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
    <invoice :show.sync="dialogFormVisible" :opinion.sync="invoiceInfo"/>
    <soa-dialog ref="soa" :sourcenumber = "source"/>
    <div class="page-operation-bottons">
      <el-row>
        <el-button v-if="checkPermission(['tms.settlement.pay.invexport']) ||checkPermission(['tms.settlement.collect.invexport'])" class="port-btn" icon="el-icon-download" @click="exportList">导出</el-button>
        <!--     <el-button class="port-btn" icon="fa fa-upload" @click="addInvocie"> 生成发票</el-button>-->
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" class="page-style" @pagination="getList"/>
      </el-row>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import EnumType from '@/constants/enumType'
import { checkList, choosepkbala, lookCheck } from '@/api/settlement'
import waves from '@/directive/waves' // Waves directive
import invoice from '@/components/Invoice'
import SoaDialog from './AccountStatement'
import checkPermission from '@/utils/permission' // 权限判断函数
import { fixedList } from '@/utils/fixedNum'
export default {
  name: 'RecBilled',
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
        type: 7, // 1未对账、2未开票、3未核销、4已核销、5全部
        bill_vbillno: '', // 发票号
        head: '',
        memo: '',
        pageNum: 1,
        pageSize: 10,
        cost_amount: ''
      },
      options: [],
      isCriteriaMore: false,
      dialogFormVisible: false,
      invoiceInfo: null,
      source: 0,
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
    checkPermission,
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
      window.location.href = 'http://www.xsungroup.cn:8089/tms/public/httpEdi/poi/exportReceFeeInfo.do?' + arrayString.substring(1)
    },
    addDialog(number) {
      var _this = this
      lookCheck({
        check_vbillno: number,
        userCode: '15001962939'
      }).then(response => {
        var costList = response.data.backFeeDtoList.map(function(item) {
          return item.cost_amount
        })
        var costMax = 0
        for (var i = 0; i < costList.length; i++) {
          costMax = _this.numAdd(costMax, costList[i] * 1)
        }
        _this.$refs.soa.postForm = {
          vbillno: response.data.check_vbillno, // 对帐号
          vbillnoType: '收', // 收付
          userCode: '15001962939',
          create_user: '15001962939', // 创建人
          vbillstatus: '0', // 订单状态
          pk_carrier: response.data.bala_customer, // 结算客户
          ent_customer: response.data.pk_customer, // 委托客户
          cost_amount: costMax,
          pk: '',
          month: response.data.account_period // 月份
        }
        _this.$refs.soa.list = response.data.backFeeDtoList
        _this.$refs.soa.type = 2
        _this.$refs.soa.dialogFormVisible = true
      })
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
    getList() {
      this.listLoading = true
      if (this.startendTime !== '') {
        this.listQuery.startTime = this.startendTime[0]
        this.listQuery.entTime = this.startendTime[1]
      }
      checkList(this.listQuery).then(response => {
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
      if (list.length > 1 || list === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选相同对账单条目!'
        })
        return false
      }
      const pk_list = this.multipleSelection.map(item => item.pk_fee)
      const vbillno = this.multipleSelection.map(item => item.invoice_vbillno)
      this.invoiceInfo = {
        pk_list: pk_list,
        vbillno: vbillno,
        price: this.numTotal
      }
      // this.$router.push({ name: 'CreateInvoice', params: { pk_list: pk_list, vbillno: vbillno }})
      this.dialogFormVisible = true
    },
    resetForm() {
      this.listQuery.bill_vbillno = ''
      this.listQuery.head = ''
      this.listQuery.memo = ''
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
        if (index !== 4) {
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
          if (index === 4) {
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
