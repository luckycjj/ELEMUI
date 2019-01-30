<template>
  <div class="">
    <el-dialog :visible.sync="visible" top="42vh" width="80%" @close="close">
      <div slot="title" class="dialog-title">
        <span style="color: #606266;margin-left:20px">费用信息 </span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span style="font-weight:700;color:blue">订单编号：{{ vbillno }}</span>
      </div>
      <el-form ref="orderForm" :model="orderForm" label-width="100px" style="margin-top:10px">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="24" :lg="8">
            <el-form-item label="委托客户：">
              <el-select v-model="orderForm.customer" placeholder="委托客户" filterable clearable disabled>
                <el-option
                  v-for="item in entCustomerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- <el-input v-model="orderForm.customer" placeholder="委托客户" readonly/> -->
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <el-form-item label="结算客户：">
              <el-select v-model="orderForm.balaCustomer" placeholder="结算客户" filterable clearable disabled>
                <el-option
                  v-for="item in entCustomerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- <el-input v-model="orderForm.balaCustomer" placeholder="结算客户" readonly/> -->
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <el-form-item label="订单编号：">
              <el-input v-model="orderForm.invoice_vbillno" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :xs="24" :sm="24" :lg="8">
            <el-form-item label="结算方式：">
              <el-radio-group v-model="orderForm.bala_type" disabled>
                <el-radio label="0">月结</el-radio>
                <el-radio label="1">现结</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <el-form-item label="支付方式：">
              <el-select v-model="orderForm.pay_type" placeholder="支付方式" clearable class="filter-item" style="width: 130px" >
                <el-option v-for="item in payOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <el-form-item label="提货地址：">
              <el-input v-model="orderForm.deli_address" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <div id="pay" style="margin:20px;font-size:16px">
          <span>收费明细</span>
          <el-button v-if="sourcenumber!==1" class="btnGreen change-btn" size="mini" @click="addRevenueOrPay(payList)">新增</el-button>
        </div>
        <el-table :data="payList.data" :summary-method="getSummaries" border style="width: 100%" highlight-current-row show-summary>
          <el-table-column
            v-for="(v,i) in payList.columns"
            :key="i"
            :prop="v.field"
            :label="v.title"
            :min-width="v.width"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input v-if="i===1" v-model="payList.sel[v.field]" placeholder="请输入内容" maxlength="10"/>
                <el-input v-else-if="i===4" v-model="payList.sel[v.field]" placeholder="请输入内容" maxlength="100"/>
                <span v-else-if="i===2">{{ scope.row[v.field] }}</span>
                <el-input-number v-else-if="i===3" v-model="payList.sel[v.field]" :max="99999999" :step="0.01" :precision="2"/>
                <span v-else>{{ scope.row[v.field] }}</span>
              </span>
              <span v-else-if="i===3">{{ scope.row[v.field].toFixed(2) }}</span>
              <span v-else>{{ scope.row[v.field] }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="sourcenumber!==1" label="操作" width="100">
            <template slot-scope="scope">
              <span
                class="el-tag el-tag--mini"
                style="cursor: pointer;"
                @click="editRevenueOrPay(scope.row,scope.$index,true,payList)"
              >{{ scope.row.isSet?"保存":"编辑" }}</span>
              <span
                v-if="!scope.row.isSet"
                class="el-tag el-tag--danger el-tag--mini"
                style="cursor: pointer;"
                @click="deleteRevenueOrPay(scope.$index, payList.data,scope.row.pk_fee)"
              >删除</span>
              <span
                v-else
                class="el-tag el-tag--danger el-tag--mini"
                style="cursor: pointer;"
                @click="editRevenueOrPay(scope.row,scope.$index,false,payList)"
              >取消</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
    </el-form></el-dialog>
  </div>
</template>

<script>
import { costInfo } from '@/api/settlement'
import { addOrUpdateFee, deleteFee, getEntCustomer } from '@/api/order'
import EnumType from '@/constants/enumType'
export default {
  name: 'ReceCost',
  components: {},

  props: {
    show: {
      type: Boolean,
      default: false
    },
    sourcenumber: {
      type: Number,
      default: null
    },
    onselect: {
      type: Function,
      default: null
    },
    opinion: {
      type: Array,
      default() {
        return []
      }
    },
    entrust_vbillno: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      visible: this.show,
      payList: {
        sel: null, // 选中行
        columns: [
          { field: 'vbillstatus', title: '状态' },
          { field: 'expense_type', title: '费目' },
          { field: 'sub_fee', title: '是否代收', width: '30px' },
          { field: 'cost_amount', title: '总额' },
          { field: 'memo', title: '备注' },
          { field: 'create_user', title: '创建人' },
          { field: 'create_time', title: '创建时间' }
        ],
        data: []
      },
      vbillno: '',
      orderForm: {
        customer: '',
        balaCustomer: '',
        pay_type: '',
        bala_type: '',
        invoice_vbillno: '',
        deli_address: ''
      },
      payOptions: EnumType.paymentStates,
      index: '',
      entCustomerList: []

    }
  },
  computed: {

  },
  watch: {
    show(val) {
      this.visible = val// 新增result的watch，监听变更并同步到myResult上
    }

  },
  created() {
    this.getEntCustomerList()
  },
  methods: {
    close() {
      this.orderForm = {
        vbillno: '',
        customer: '',
        balaCustomer: '',
        pay_type: '',
        bala_type: '',
        invoice_vbillno: '',
        deli_address: ''
      }
      this.payList.data = []
      this.$emit('update:show', false)
    },
    save() {
      if (this.onselect) {
        this.onselect()
        this.$emit('update:show', false)
      }
    },
    addRevenueOrPay(item) {
      for (const i of item.data) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const j = {
        pk_fee: '',
        vbillstatus: '未确认',
        expense_type: '',
        sub_fee: 'N',
        cost_amount: '',
        memo: '',
        create_user: '',
        create_time: '',
        isSet: true
      }
      item.data.push(j)
      item.sel = JSON.parse(JSON.stringify(j))
    },
    deleteRevenueOrPay(index, rows, data) {
      if (rows[index].vbillstatus !== '未确认') {
        return this.$message.warning('未确认的费用才能删除')
      }
      this.$confirm('此操作将删除该记录, 是否确认?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const item = {
          pk_fee: data,
          userCode: '15111111112'
        }
        deleteFee(item).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 5000
          })
          rows.splice(index, 1)
        })
      })
    },
    editRevenueOrPay(row, index, cg, item) {
      this.flag = row.isSet
      this.index = index
      // 点击修改 判断是否已经保存所有操作
      for (const i of item.data) {
        if (i.isSet && i.isSet !== row.isSet) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      // 是否是取消操作
      if (!cg) {
        if (item.sel.isSet) item.data.splice(index, 1)
        return (row.isSet = !row.isSet)
      }
      if (row.isSet) {
        if ((!item.sel.expense_type || !item.sel.cost_amount)) {
          return this.$message.warning('请确认费目和合计金额')
        }
        if (item.sel.vbillstatus !== '未确认') {
          return this.$message.warning('未确认的费用才能编辑')
        }
        const data = JSON.parse(JSON.stringify(item.sel))
        for (const k in data) row[k] = data[k]
        const msg = {
          fee_type: 1,
          expense_type: item.sel.expense_type,
          pk_customer: this.orderForm.customer,
          pay_type: this.orderForm.pay_type,
          bala_type: this.orderForm.bala_type,
          bala_customer: this.orderForm.balaCustomer,
          invoice_vbillno: this.vbillno,
          deli_address: this.orderForm.deli_address,
          memo: item.sel.memo,
          sub_fee: item.sel.sub_fee,
          cost_amount: item.sel.cost_amount,
          pk_fee: item.sel.pk_fee,
          userCode: '15111111112'
        }
        this.editFee(msg)
        row.isSet = false
      } else {
        item.sel = JSON.parse(JSON.stringify(row))
        row.isSet = true
      }
    },
    getCostInfo(item) {
      this.vbillno = item
      const data = {
        invoice_vbillno: item,
        userCode: '15001962939'
      }
      costInfo(data).then(response => {
        // console.log(response.data.data)

        this.orderForm.invoice_vbillno = response.data.data.invoice_vbillno
        this.orderForm.balaCustomer = response.data.data.balaCustomer
        this.orderForm.customer = response.data.data.customer
        this.orderForm.deli_address = response.data.data.deli_address
        this.orderForm.bala_type = response.data.data.bala_type.toString()
        this.orderForm.pay_type = response.data.data.pay_type.toString()
        this.payList.data = []
        for (const item of response.data.data.costInfoVOs) {
          this.payList.data.push({
            'vbillstatus': this.changeState(item.vbillstatus),
            'expense_type': item.expense_type,
            'sub_fee': item.sub_fee,
            'memo': item.memo,
            'cost_amount': item.cost_amount,
            'create_user': item.create_user,
            'create_time': item.create_time,
            'pk_fee': item.pk_fee,
            'isSet': false })
        }
      })
    },
    changeState(item) {
      if (item === 0) {
        return '未确认'
      } else if (item === 1) {
        return '已确认'
      } else if (item === 2) {
        return '已对账'
      } else if (item === 3) {
        return '已开票'
      } else if (item === 4) {
        return '已核销'
      } else {
        return ''
      }
    },
    // 编辑费目
    editFee(data) {
      addOrUpdateFee(data).then(response => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: '保存成功!',
            duration: 5000
          })
          // console.log(response.data)
          this.$set(this.payList.data[this.index], 'pk_fee', response.data.pk)
          const data = {
            invoice_vbillno: this.vbillno,
            userCode: '15001962939'
          }
          costInfo(data).then(response => {
            this.payList.data = []
            for (const item of response.data.data.costInfoVOs) {
              this.payList.data.push({
                'vbillstatus': this.changeState(item.vbillstatus),
                'expense_type': item.expense_type,
                'sub_fee': item.sub_fee,
                'memo': item.memo,
                'cost_amount': item.cost_amount,
                'create_user': item.create_user,
                'create_time': item.create_time,
                'pk_fee': item.pk_fee,
                'isSet': false })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '保存失败!',
            duration: 5000
          })
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计：'
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
          }, 0).toFixed(2)
          sums[index] += '(元)'
        } else {
          sums[index] = ''
        }
      })

      return sums
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
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.btnGreen {
      margin-left: 20px;
 }
 .note {
    background-color: #f5f8fd;
    border-color: #8bb4e7;
    color: #010407;
}
.control-label {
    text-align: right;
}
</style>

