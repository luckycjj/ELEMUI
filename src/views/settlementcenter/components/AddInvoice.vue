<template>
  <div class="createPost-container">
    <el-form ref="invoiceForm" :model="invoiceForm" :rules="rules" label-width="120px" label-position="left" status-icon>
      <div class="createPost-main-container">
        <div class="portlet light">
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              发票详情：
              <span >订单号：{{ vbillno }}</span>
            </div>
          </div>
          <div class="portlet-body form">
            <div class="form-body">
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item
                    label="发票编号："
                    prop="bill_vbillno">
                    <el-input v-model="invoiceForm.bill_vbillno" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="抬头类型：">
                    <el-radio-group v-model="invoiceForm.head_type">
                      <el-radio :label="2">企业单位</el-radio>
                      <el-radio :label="1">个人/非企业单位</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="发票抬头：">
                    <el-input v-model="invoiceForm.head" placeholder="发票抬头"/>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="税号：">
                    <el-input v-model="invoiceForm.tax_num" placeholder="税号" type="number"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="发票内容：">
                    <el-input v-model="invoiceForm.bill_content" placeholder="开票（费目）"/>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="发票金额：">
                    <el-input v-model="invoiceForm.bill_amount" placeholder="发票金额" type="number">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="开票日期：">
                    <el-date-picker
                      v-model="invoiceForm.req_deli_date"
                      type="date"
                      placeholder="开票日期"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="开票人：">
                    <el-input v-model="invoiceForm.amount" placeholder="发票人"/>
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="备注：">
                    <el-input v-model="invoiceForm.memo" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="发票类型：">
                    <el-radio-group v-model="invoiceForm.bill_type">
                      <el-radio :label="2">纸质发票</el-radio>
                      <el-radio :label="1">电子发票</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="portlet light">
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              纸质发票：
            </div>
          </div>
          <div class="portlet-body form">
            <div class="form-body">
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="收件人：">
                    <el-input v-model="invoiceForm.accept_man" placeholder="收件人"/>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item label="联系方式：">
                    <el-input v-model="invoiceForm.accept_contact" placeholder="联系方式"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="4">
                  <el-form-item label="所在地方：" prop="province">
                    <el-input v-model="invoiceForm.province" placeholder="省" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="4" >
                  <el-form-item prop="city" label-width="0">
                    <el-input v-model="invoiceForm.city" placeholder="市" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="4">
                  <el-form-item prop="area" label-width="0">
                    <el-input v-model="invoiceForm.area" placeholder="区" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                  <el-form-item prop="address" label="详细地址：">
                    <el-input
                      v-model="invoiceForm.address"
                      placeholder="详细地址"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="8">
                  <el-form-item label="快递公司：" >
                    <el-select v-model="invoiceForm.express_corp" placeholder="请选择" @change="express">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="4">
                  <el-input v-model="invoiceForm.express_memo" :disabled="flag"/>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="4">
                  <el-input v-model="invoiceForm.express_no" placeholder="快递单号" />
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="portlet light">
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              (电子发票) 接受方式：
            </div>
          </div>
          <div class="portlet-body form">
            <div class="form-body">
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :lg="16">
                  <el-form-item prop="email" label="邮件地址">
                    <el-input
                      v-model="invoiceForm.email"
                      placeholder="邮件地址"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row :gutter="24">
              </el-row> -->
            </div>
          </div>
          <div class="page-operation-bottons">
            <!-- <div style="margin: 10px 20px;float:left">总金额：{{ totalSum }}</div> -->
            <el-button
              v-loading="loading"
              style="margin: 10px 20px;float:right"
              type="primary"
              icon="el-icon-check"
              @click="submitForm"
            >保存</el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { createBill } from '@/api/settlement'
export default {
  name: 'AddInvoice',
  components: {},

  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkBill = (rule, value, callback) => {
      // debugger
      if (!value) {
        return callback(new Error('发票号不能为空'))
      }
      setTimeout(() => {
        var regPos = /^[0-9]+$/
        if (!regPos.test(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      visible: this.show,
      loading: false,
      invoiceForm: {
        pks: [],
        fee_type: 1,
        bill_vbillno: '',
        head_type: '',
        head: '',
        tax_num: '',
        bill_amount: '',
        bill_content: '',
        memo: '',
        bill_type: '',
        accept_contact: '',
        accept_man: '',
        province: '',
        city: '',
        area: '',
        address: '',
        email: '',
        wechat: '',
        qq_num: '',
        qrCode: '',
        express_corp: '',
        express_no: '',
        express_memo: '',
        userCode: '15111111112'
      },
      options: [{
        value: '申通快递',
        label: '申通快递'
      }, {
        value: '顺丰快递',
        label: '顺丰快递'
      }, {
        value: '圆通快递',
        label: '圆通快递'
      }, {
        value: '其他',
        label: '其他'
      }],
      flag: true,
      vbillno_list: [],
      vbillno: '',
      rules: {
        bill_vbillno: [
          { validator: checkBill, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show(val) {
      this.visible = val// 新增result的watch，监听变更并同步到myResult上
    }

  },
  created() {
    if (this.$route.params) {
      this.invoiceForm.pks = this.$route.params.pk_list
      this.vbillno_list = this.$route.params.vbillno
      this.vbillno = this.vbillno_list.join('、')
    }

    // console.log(this.vbillno)
  },
  methods: {
    // 选择快递
    express(val) {
      if (val === '其他') {
        this.flag = false
      } else {
        this.flag = true
        this.invoiceForm.express_memo = ''
      }
    },
    // 保存
    submitForm() {
      this.$refs.invoiceForm.validate((valid) => {
        if (valid) {
          createBill(this.invoiceForm).then(response => {
            // console.log(response.data)
            this.$message({
              type: 'success',
              message: '保存成功!',
              duration: 5000
            })
          })
            .catch((error) => {
              this.$message({
                type: 'warning',
                message: '保存失败!',
                duration: 5000
              })
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
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
    .btnGreen {
      margin-bottom: 10px;
      color: #fff;
      background-color: #32c5d2;
      border-color: #32c5d2;
    }
    .tableMargin{
      margin-bottom: 80px;
    }
  }

}
</style>
