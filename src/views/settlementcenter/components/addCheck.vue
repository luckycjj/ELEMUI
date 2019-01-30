<template>
  <el-dialog :visible.sync="dialogForm" :fullscreen="true" :modal = "false" title="新增明细" @close="closeDialog">
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
        end-placeholder="结算结束日期"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="resetForm">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
      <el-button v-waves class="filter-item" type="primary" @click="save">保存</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="dialogForm = false" > 取消</el-button>
      <el-collapse-transition>
        <div v-show="isCriteriaMore">
          <el-input v-model="listQuery.invoice_vbillno" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.deli_address" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <div class="clearBoth"/>
          <el-select v-model="listQuery.bala_type" placeholder="请选择结算方式" style="width: 200px;" clearable>
            <el-option
              v-for="item in bala_typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-model="listQuery.pay_type" placeholder="请选择支付方式" style="width: 200px;" clearable>
            <el-option
              v-for="item in pay_typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-model="listQuery.origin_type" placeholder="请选择来源" style="width: 200px;" clearable>
            <el-option
              v-for="item in origin_typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
      </el-collapse-transition>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="55"/>
      <!--<el-table-column prop="bill_vbillno" label="发票号" min-width="100"/>-->
      <el-table-column prop="exp_type" label="费目" min-width="100"/>
      <el-table-column prop="pk_customer" label="委托客户" min-width="120"/>
      <el-table-column prop="bala_customer" label="结算客户" min-width="120"/>
      <el-table-column prop="invoice_vbillno" label="订单号" min-width="120">
        <template slot-scope="scope">
          <router-link :to="'/ordercenter/order-details/' + scope.row.invoice_vbillno" class="link-type">
            <span>{{ scope.row.invoice_vbillno }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="deli_address" label="提货地址" min-width="200"/>
      <el-table-column prop="cost_amount" label="总额" min-width="100"/>
      <el-table-column prop="got_amount" label="已核销金额" min-width="100"/>
      <el-table-column prop="ungot_amount" label="待核销金额" min-width="100"/>
      <el-table-column prop="create_user" label="创建人" min-width="120"/>
      <el-table-column prop="create_time" label="创建时间" min-width="120"/>
      <el-table-column prop="bala_type" label="结算方式" min-width="80"/>
      <el-table-column prop="pay_type" label="支付方式" min-width="80"/>
      <el-table-column prop="modify_user" label="更新人" min-width="100"/>
      <el-table-column prop="modify_time" label="更新时间" min-width="120"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </el-dialog>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SoaDialog from './AccountStatement'
// import EnumType from '@/constants/enumType'
import { checkList, choosepkbala, addCheck, checkPayList } from '@/api/settlement'
import waves from '@/directive/waves'
import ElButton from 'element-ui/packages/button/src/button' // Waves directive

export default {
  name: 'AddCheck',
  components: {
    ElButton,
    Pagination, SoaDialog },
  directives: { waves },
  props: {
    nowList: {
      type: Array,
      default() {
        return []
      }
    },
    vbillnumber: {
      type: String,
      default: null
    },
    sourcenumber: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      source: '',
      dialogForm: false,
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
    closeDialog: function() {
      var _this = this
      _this.multipleSelection = []
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.listLoading = true
      if (this.startendTime !== '') {
        this.listQuery.startTime = this.startendTime[0]
        this.listQuery.entTime = this.startendTime[1]
      }
      // debugger
      if (this.$props.sourcenumber === 0) {
        checkList(this.listQuery).then(response => {
          // console.log(response)
          this.list = response.data.records
          this.total = response.data.totalCount || 0
          // Just to simulate the time of the request
          this.listLoading = false
        })
      } else if (this.$props.sourcenumber === 1) {
        checkPayList(this.listQuery).then(response => {
          // console.log(response)
          this.list = response.data.records
          this.total = response.data.totalCount || 0
          // Just to simulate the time of the request
          this.listLoading = false
        })
      }
    },
    handleFilter() {
      /*  console.log(this.listQuery);*/
      this.listQuery.pageNum = 1
      this.getList()
    },
    save: function() {
      var _this = this
      if (_this.multipleSelection.length === 0) {
        _this.$message({
          type: 'warning',
          message: '请先勾选需开票的条目!'
        })
        return false
      }
      var List = _this.$props.nowList.concat()
      var pk_list = List.map(item => item.pk_fee)
      for (var i = 0; i < _this.multipleSelection.length; i++) {
        if (pk_list.indexOf(_this.multipleSelection[i].pk_fee) === -1) {
          List.push(_this.multipleSelection[i])
        }
      }
      if (!_this.selectArr(List)) {
        _this.$message({
          type: 'warning',
          message: '请勾选相同委托客户,结算客户,结算方式的账单!'
        })
        return false
      }
      addCheck({
        pks: _this.multipleSelection.map(item => item.pk_fee),
        check_vbillno: _this.$props.vbillnumber
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
        _this.$emit('listChanged', List)
        _this.dialogForm = false
      })
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
      this.startendTime = ''
      this.listQuery.startTime = ''
      this.listQuery.entTime = ''
      this.listQuery.invoice_vbillno = ''
      this.listQuery.deli_address = ''
      this.listQuery.bala_type = ''
      this.listQuery.pay_type = ''
      this.listQuery.origin_type = ''
      this.getList()
    }
  }
}

</script>
<style scoped>
  .clearBoth{
    clear:both;
  }
</style>
