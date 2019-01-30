<template>
  <el-dialog :visible.sync="dialogFormVisible" title="对账单">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      label-position="left"
      label-width="120px"
      class="form-container el-form"
    >
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="8">
          <el-form-item label="对账号">
            <el-input v-model="postForm.vbillno" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <el-form-item label="收付">
            <el-input v-model="postForm.vbillnoType" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <el-form-item label="结算客户">
            <el-input v-model="postForm.pk_carrier" :disabled="true" placeholder="结算客户"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="8">
          <el-form-item label="委托客户">
            <el-input v-model="postForm.ent_customer" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <el-form-item label="结算月份">
            <el-date-picker
              v-if="type == 0"
              v-model="postForm.month"
              type="month"
              placeholder="结算月份"
              format="yyyy-MM"
              value-format="yyyy-MM"
              class="required"
            />
            <el-input v-else v-model="postForm.month" :disabled="true" placeholder="结算月份"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <el-form-item label="总金额(元)">
            <el-input v-model="postForm.cost_amount" :disabled="true"/>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-body"/>
    </el-form>
    <div v-if="type === 1" style="margin-bottom: 15px;">
      <el-button @click="deleteCheck">删除明细</el-button>
      <el-button type="primary" @click="addCheck">新增明细</el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column v-if="type === 1" type="selection" min-width="55"/>
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
      <el-table-column prop="cost_amount" label="总额" min-width="80"/>
      <el-table-column prop="got_amount" label="已核销金额" min-width="120"/>
      <el-table-column prop="ungot_amount" label="待核销金额" min-width="120"/>
      <el-table-column prop="create_user" label="创建人" min-width="120"/>
      <el-table-column prop="create_time" label="创建时间" min-width="120"/>
      <el-table-column prop="bala_type" label="结算方式" min-width="80"/>
      <el-table-column prop="pay_type" label="支付方式" min-width="80"/>
      <el-table-column prop="modify_user" label="更新人" min-width="100"/>
      <el-table-column prop="modify_time" label="更新时间" min-width="120"/>
    </el-table>
    <addcheck ref="soa" :sourcenumber.sync="source" :now-list = "list" :vbillnumber="postForm.vbillno" @listChanged="listChange"/>
    <div v-if="type === 0" slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createCheck, deleteCheck, PayCheckcreateCheck } from '@/api/settlement'
import addcheck from './addCheck'
export default {
  name: 'AccountStatement',
  components: { addcheck },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    sourcenumber: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      postForm: {
        vbillno: '', // 订单单号
        userCode: '15001962939',
        create_user: '15001962939', // 创建人
        vbillstatus: '0', // 订单状态
        pk_carrier: '', // 结算客户
        ent_customer: '', // 委托客户
        cost_amount: '',
        month: '', // 月份
        pk: ''
      },
      type: 0,
      list: [],
      cleanList: [],
      loading: false,
      mouth: [],
      multipleSelection: [],
      dialogFormVisible: false,
      rules: {},
      source: ''
    }
  },
  mounted() {
    this.source = this.$props.sourcenumber
  },
  methods: {
    listChange(arr) {
      this.list = arr
      this.postForm.cost_amount = 0
      for (var i = 0; i < this.list.length; i++) {
        this.postForm.cost_amount = this.numAdd(this.postForm.cost_amount, this.list[i].cost_amount * 1)
      }
      this.$parent.handleFilter()
    },
    save() {
      var _this = this
      if (_this.postForm.month === '') {
        _this.$message({
          type: 'warning',
          message: '请选择结算月份!'
        })
        return false
      }
      if (_this.source === 0) {
        createCheck({
          pks: _this.postForm.pk,
          account_period: _this.postForm.month,
          cost_amount: _this.postForm.cost_amount,
          userCode: '15001962939'
        }).then(response => {
          _this.$message({
            type: 'success',
            message: '操作成功'
          })
          _this.$parent.handleFilter()
          _this.dialogFormVisible = false
        })
      } else if (_this.source === 1) {
        PayCheckcreateCheck({
          pks: _this.postForm.pk,
          account_period: _this.postForm.month,
          cost_amount: _this.postForm.cost_amount,
          userCode: '15001962939'
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
          _this.$parent.handleFilter()
          _this.dialogFormVisible = false
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteCheck() {
      var _this = this
      if (_this.multipleSelection.length < 1) {
        _this.$message({
          type: 'warning',
          message: '请先勾选需删除的条目!'
        })
        return false
      }
      var list = []
      for (var i = 0; i < _this.multipleSelection.length; i++) {
        list.push(_this.multipleSelection[i].pk_fee)
      }
      deleteCheck(list).then(response => {
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
        for (var i = 0; i < list.length; i++) {
          for (var x = 0; x < _this.list.length; x++) {
            if (list[i] === _this.list[x].pk_fee) {
              _this.postForm.cost_amount = _this.numSub(_this.postForm.cost_amount, _this.list[x].cost_amount * 1)
              _this.list.splice(x, 1)
              break
            }
          }
        }
        this.$parent.handleFilter()
      })
    },
    addCheck() {
      var _this = this
      _this.$refs.soa.dialogForm = true
      _this.$refs.soa.getList()
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
    numSub(num1, num2) {
      // 减法精度
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
      return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../styles/mixin.scss";
.createPost-container {
  position: relative;
  background: #eff3f8;
  .createPost-main-container {
    padding: 20px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }

}
</style>
