<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.create_user" placeholder="创建人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.check_vbillno" placeholder="对帐号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="listQuery.account_period"
        type="month"
        placeholder="对账月份"
        format="yyyy-MM"
        value-format="yyyy-MM"
        style="width: 200px;"
        class="filter-item"
      />
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
      <el-table-column prop="vbillstatus" label="状态" min-width="120"/>
      <el-table-column prop="check_vbillno" label="对帐号" min-width="160">
        <template slot-scope="scope">
          <span style="color:#409EFF" @click="addDialog(scope.row.check_vbillno,scope.row.vbillstatus)">{{ scope.row.check_vbillno }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cost_amount" label="总额" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeItem(scope.row.cost_amount) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_user" label="创建人" min-width="120"/>
      <el-table-column prop="create_time" label="创建时间" min-width="160"/>
      <el-table-column prop="modify_user" label="更新人" min-width="100"/>
      <el-table-column prop="modify_time" label="更新时间" min-width="160"/>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
    <soa-dialog ref="soa" :sourcenumber = "source"/>
    <div class="page-operation-bottons">
      <el-row>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" class="page-style" @pagination="getList"/>
        <el-button v-if="checkPermission(['tms.settlement.collect.ensure'])|| checkPermission(['tms.settlement.pay.ensure'])" class="confrim-btn" icon="el-icon-success" @click="sureOrder">确认</el-button>
        <el-button v-if="checkPermission(['tms.settlement.collect.delete']) || checkPermission(['tms.settlement.pay.delete'])" class="cancel-btn" icon="el-icon-delete" @click="deleteOrder">删除对账单</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import EnumType from '@/constants/enumType'
import { choosepkbala, lookCheck, ReceCheckList, ReceCheckConfirmCheck, ReceCheckDeleteCheckHead } from '@/api/settlement'
import waves from '@/directive/waves' // Waves directive
import invoice from '@/components/Invoice'
import SoaDialog from './AccountStatement'
import checkPermission from '@/utils/permission' // 权限判断函数
import { fixedList } from '@/utils/fixedNum'
export default {
  name: 'Recaccount',
  components: { Pagination, invoice, SoaDialog },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      numTotal: 0,
      pk_customerList: [{
        value: '',
        label: '请选择委托单位'
      }],
      bala_customerList: [{
        value: '',
        label: '请选择结算单位'
      }],
      bala_typeList: [{
        value: '',
        label: '请选择结算方式'
      }, {
        value: 0,
        label: '月结'
      }, {
        value: 1,
        label: '现结付'
      }],
      pay_typeList: [{
        value: '',
        label: '请选择支付方式'
      }, {
        value: 1,
        label: '电汇'
      }, {
        value: 2,
        label: '现金'
      }, {
        value: 3,
        label: '支票'
      }, {
        value: 4,
        label: '代收'
      }, {
        value: 5,
        label: '代付'
      }],
      origin_typeList: [{
        value: '',
        label: '请选择来源'
      }, {
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
        type: 6,
        pageNum: 1,
        pageSize: 10,
        check_vbillno: '',
        account_period: '',
        create_user: ''
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
    addDialog(number, vbillstatus) {
      var _this = this
      lookCheck({
        check_vbillno: number,
        userCode: '15001962939'
      }).then(response => {
        // console.log(response)
        var costList = response.data.data.backFeeDtoList.map(function(item) {
          return item.cost_amount
        })
        var costMax = 0
        for (var i = 0; i < costList.length; i++) {
          costMax = _this.numAdd(costMax, costList[i] * 1)
        }
        _this.$refs.soa.postForm = {
          vbillno: response.data.data.check_vbillno, // 对帐号
          vbillnoType: '收', // 收付
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
        if (vbillstatus === '未确认') {
          _this.$refs.soa.type = 1
        } else if (vbillstatus === '已确认') {
          _this.$refs.soa.type = 2
        }

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
      ReceCheckList(this.listQuery).then(response => {
        this.list = response.data.records

        this.total = response.data.totalCount || 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    deleteOrder() {
      var _this = this
      if (_this.multipleSelection.length <= 0) {
        _this.$message({
          type: 'warning',
          message: '请先勾选需删除的对账单!'
        })
        return false
      }
      const type_list = _this.multipleSelection.map(item => item.vbillstatus)
      if (type_list.indexOf('已确认') !== -1) {
        _this.$message({
          type: 'warning',
          message: '只有未确认的对账单才能删除!'
        })
        return false
      }
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const check_vbillno = _this.multipleSelection.map(item => item.check_vbillno)
        ReceCheckDeleteCheckHead(check_vbillno).then(response => {
          if (response.data === true || response.data.success) {
            _this.$message({
              type: 'success',
              message: '操作成功'
            })
          } else {
            _this.$message({
              type: 'warning',
              message: response.data.msg
            })
          }
          this.listQuery.pageNum = 1
          this.getList()
        })
      })
    },
    sureOrder() {
      var _this = this
      if (_this.multipleSelection.length <= 0) {
        _this.$message({
          type: 'warning',
          message: '请先勾选需确认的条目!'
        })
        return false
      }
      const type_list = _this.multipleSelection.map(item => item.vbillstatus)
      if (type_list.indexOf('已确认') !== -1) {
        _this.$message({
          type: 'warning',
          message: '只有未确认的对账单才能确认!'
        })
        return false
      }
      const check_vbillno = _this.multipleSelection.map(item => item.check_vbillno)
      ReceCheckConfirmCheck({
        pks: check_vbillno
      }).then(response => {
        if (response.data) {
          _this.$message({
            type: 'success',
            message: '操作成功'
          })
        } else {
          _this.$message({
            type: 'warning',
            message: response.data.msg
          })
        }
        this.listQuery.pageNum = 1
        this.getList()
      })
    },
    resetForm() {
      this.listQuery.create_user = ''
      this.listQuery.check_vbillno = ''
      this.listQuery.account_period = ''
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
        if (index !== 3) {
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
          if (index === 3) {
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
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .clearBoth{
    clear:both;
  }
</style>
