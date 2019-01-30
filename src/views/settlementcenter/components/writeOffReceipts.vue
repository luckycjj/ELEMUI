<template>
  <el-dialog :visible.sync="dialogFormVisible" title="核销信息">
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
          <el-form-item label="核销号">
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
          <el-form-item label="核销日期">
            <el-input v-model="postForm.month" :disabled="true" placeholder="核销日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="16">
          <el-form-item label="账单日期">
            <el-date-picker
              v-model="startendTime"
              type="datetimerange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              class="filter-item"
              style="width:400px;"
              range-separator="-"
              start-placeholder="账单开始日期"
              end-placeholder="账单结束日期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="8">
          <el-form-item label="总金额">
            <el-input v-model="postForm.cost_amount" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <el-form-item label="核销金额">
            <el-input v-model="postForm.write_amount" type="number"/>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-body"/>
    </el-form>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column prop="bill_vbillno" label="发票号" min-width="100"/>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { ReceCheck } from '@/api/settlement'
export default {
  name: 'AccountStatement',
  components: { },
  props: {
    isEdit: {
      type: Boolean,
      default: false
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
        write_amount: '',
        pk: ''
      },
      startendTime: '',
      list: [],
      loading: false,
      mouth: [],
      dialogFormVisible: false,
      rules: {}
    }
  },
  methods: {
    save() {
      var _this = this
      console.log(_this.postForm.write_amount)
      if (_this.postForm.write_amount === '' || _this.postForm.write_amount > _this.postForm.cost_amount) {
        _this.$message({
          type: 'warning',
          message: '请输入正确的核销金额!'
        })
        return false
      }
      ReceCheck({
        pks: _this.postForm.pk,
        totalAmount: _this.postForm.cost_amount * 1,
        checkAmount: _this.postForm.write_amount * 1,
        userCode: '15001962939'
      }).then(response => {
        _this.$parent.handleFilter()
        _this.dialogFormVisible = false
      })
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
