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
        end-placeholder="结算结束日期"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
      <el-collapse-transition>
        <div v-show="isCriteriaMore">
          <el-input v-model="listQuery.invoice_vbillno" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.deli_address" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.bill_vbillno" placeholder="发票号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model="listQuery.check_vbillno" placeholder="对帐号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <div class="clearBoth"/>
          <el-date-picker
            v-model="listQuery.account_period"
            type="month"
            style="width: 200px;"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择账期"/>
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
      border
      fit
      highlight-current-row
      tooltip-effect="light"
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="55"/>
      <el-table-column prop="bill_vbillno" label="发票号" min-width="120"/>
      <el-table-column prop="check_vbillno" label="对帐号" min-width="120"/>
      <el-table-column prop="exp_type" label="费目" min-width="100"/>
      <el-table-column prop="pk_customer" label="委托客户" min-width="120"/>
      <el-table-column prop="bala_customer" label="结算客户" min-width="120"/>
      <el-table-column prop="invoice_vbillno" label="订单号" min-width="160">
        <template slot-scope="scope">
          <router-link :to="'/ordercenter/order-details/' + scope.row.invoice_vbillno" class="link-type">
            <span>{{ scope.row.invoice_vbillno }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="deli_address" label="提货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="cost_amount" label="总额" min-width="120"/>
      <el-table-column prop="got_amount" label="已核销金额" min-width="120"/>
      <el-table-column prop="ungot_amount" label="待核销金额" min-width="120"/>
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
    <div class="page-operation-bottons">
      <el-row>
        <el-button class="port-btn" icon="el-icon-download">导出</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" class="page-style" @pagination="getList"/>
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import EnumType from '@/constants/enumType'
import { checkList, choosepkbala } from '@/api/settlement'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'AllReceivablebill',
  components: { Pagination },
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
        userCode: '15001962939', // 用户编码
        type: 5, // 1未对账、2未开票、3未核销、4已核销、5全部
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
      return innerHeight - 470
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
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.numTotal = 0
      if (this.multipleSelection.length <= 0) {
        this.costState = false
      }
      for (var data of this.multipleSelection) {
        this.numTotal += data.cost_amount
      }
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
        this.list = response.data.items

        this.total = response.data.totalCount || 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetForm() {
      this.listQuery.pk_customer = ''
      this.listQuery.bala_customer = ''
      this.listQuery.startTime = ''
      this.listQuery.entTime = ''
      this.startendTime = ''
      this.listQuery.invoice_vbillno = ''
      this.listQuery.deli_address = ''
      this.listQuery.check_vbillno = ''
      this.listQuery.bill_vbillno = ''
      this.listQuery.account_period = ''
      this.listQuery.bala_type = ''
      this.listQuery.pay_type = ''
      this.listQuery.origin_type = ''
      this.getList()
    }

  }
}

</script>

