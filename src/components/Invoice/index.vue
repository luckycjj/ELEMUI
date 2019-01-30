<template>
  <div class="">
    <el-dialog :visible.sync="visible" title="发票详情" width="70%" @close="close">
      <el-form ref="invoiceForm" :model="invoiceForm" :rules="rules" label-width="120px" label-position="left" status-icon>
        <div class="createPost-main-container">
          <div class="portlet light">
            <div class="portlet-title">
              <div class="caption">
                <i class="icon-equalizer"/>
                <span >订单号：{{ vbillno }}</span>
              </div>
            </div>
            <div class="portlet-body form">
              <div class="form-body">
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="12">
                    <el-form-item
                      label="发票号："
                      prop="bill_vbillno">
                      <el-input v-model="invoiceForm.bill_vbillno" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="12">
                    <el-form-item label="抬头类型：">
                      <el-radio-group v-model="invoiceForm.head_type" >
                        <el-radio :label="2">企业单位</el-radio>
                        <el-radio :label="1">个人/非企业单位</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="12">
                    <el-form-item label="发票抬头：">
                      <el-input v-model="invoiceForm.head" placeholder="发票抬头" readonly/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="12">
                    <el-form-item label="税号：">
                      <el-input v-model="invoiceForm.tax_num" placeholder="税号" readonly/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="12">
                    <el-form-item label="发票内容：">
                      <el-input v-model="invoiceForm.bill_content" placeholder="开票（费目）" readonly/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="12">
                    <el-form-item label="发票金额(元)：">
                      <el-input-number v-model="invoiceForm.bill_amount" :max="999999999" :step="1" :precision="2" disabled/>
                      <!-- <el-input v-model="invoiceForm.bill_amount" placeholder="发票金额" type="number">
                        <template slot="append">元</template>
                      </el-input> -->
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="12">
                    <el-form-item label="备注：">
                      <el-input v-model="invoiceForm.memo" readonly/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="12">
                    <el-form-item label="发票类型：">
                      <el-radio-group v-model="invoiceForm.bill_type" @change="billType">
                        <el-radio :label="2">纸质发票</el-radio>
                        <el-radio :label="1">电子发票</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-if="formFlag">
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
                      <el-form-item label="收件人：" prop="accept_man">
                        <el-input v-model="invoiceForm.accept_man" placeholder="收件人"/>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                      <el-form-item label="联系方式：" prop="accept_contact">
                        <el-input v-model="invoiceForm.accept_contact" placeholder="联系方式" type="number" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :xs="24" :sm="24" :lg="5">
                      <el-form-item label="所在地方：" prop="province">
                        <!-- <el-input v-model="invoiceForm.province" placeholder="省" />-->
                        <el-select v-model="invoiceForm.province" placeholder="请选择省" style="width: 140px;" @change="selectPro">
                          <el-option
                            v-for="item in provinceList"
                            :key="item.region"
                            :label="item.region"
                            :value="item.region"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="3" >
                      <el-form-item prop="city" label-width="0">
                        <!--<el-input v-model="invoiceForm.city" placeholder="市" />-->
                        <el-select v-model="invoiceForm.city" placeholder="请选择市" style="width: 140px;" @change="selectCity">
                          <el-option
                            v-for="item in cityList"
                            :key="item.region"
                            :label="item.region"
                            :value="item.region"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="4">
                      <el-form-item prop="area" label-width="0">
                        <!--<el-input v-model="invoiceForm.area" placeholder="区" />-->
                        <el-select v-model="invoiceForm.area" placeholder="请选择区" style="width: 140px;">
                          <el-option
                            v-for="item in areaList"
                            :key="item.region"
                            :label="item.region"
                            :value="item.region"/>
                        </el-select>
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
                      <el-form-item label="快递公司：" prop="express_corp">
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
                      <el-form-item prop="express_no" label-width="0">
                        <el-input v-model="invoiceForm.express_no" placeholder="快递单号" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!formFlag" >
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
                </div>
              </div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer" style="margin-top:-20px;float:right">
            <el-button
              v-loading="loading"
              type="primary"
              icon="el-icon-check"
              @click="submitForm"
            >保存</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { createBill, payCreateBill } from '@/api/settlement'
import { provinceCityArea } from '@/utils/provinceCityArea'
import { Debounce } from '@/utils/debounce'
export default {
  name: 'Invoice',
  components: {},

  props: {
    show: {
      type: Boolean,
      default: false
    },
    onselect: {
      type: Function,
      default: null
    },
    opinion: {
      type: Object,
      default() {
        return {}
      }
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
    var checkAcceptMan = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 2 && !value) {
        this.$refs.invoiceForm.clearValidate(['email'])
        return callback(new Error('请填写收件人'))
      } else if (this.invoiceForm.bill_type === 1) {
        callback()
        this.$refs.invoiceForm.clearValidate(['accept_man'])
      } else {
        callback()
      }
    }
    var checkAcceptContact = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 2 && !value) {
        return callback(new Error('请填写联系电话'))
      } else if (this.invoiceForm.bill_type === 1) {
        callback()
        this.$refs.invoiceForm.clearValidate(['accept_contact'])
      } else {
        if (value.toString().length > 12) {
          return callback(new Error('请输入正确的号码'))
        }
        // console.log(value.toString().length)
        callback()
      }
    }
    var checkProvince = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 2 && !value) {
        return callback(new Error('请填写省'))
      } else if (this.invoiceForm.bill_type === 1) {
        callback()
        this.$refs.invoiceForm.clearValidate(['province'])
      } else {
        callback()
      }
    }
    var checkCity = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 2 && !value) {
        return callback(new Error('请填写市'))
      } else if (this.invoiceForm.bill_type === 1) {
        callback()
        this.$refs.invoiceForm.clearValidate(['city'])
      } else {
        callback()
      }
    }
    var checkArea = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 2 && !value) {
        return callback(new Error('请填写区'))
      } else if (this.invoiceForm.bill_type === 1) {
        callback()
        this.$refs.invoiceForm.clearValidate(['area'])
      } else {
        callback()
      }
    }
    var checkAddress = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 2 && !value) {
        return callback(new Error('请填写详细地址'))
      } else if (this.invoiceForm.bill_type === 1) {
        callback()
        this.$refs.invoiceForm.clearValidate(['address'])
      } else {
        callback()
      }
    }
    var checkExpressCorp = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 2 && !value) {
        return callback(new Error('请选择快递公司'))
      } else if (this.invoiceForm.bill_type === 1) {
        callback()
        this.$refs.invoiceForm.clearValidate(['express_corp'])
      } else {
        callback()
      }
    }
    var checkExpressNo = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 2 && !value) {
        return callback(new Error('请填写快递单号'))
      } else if (this.invoiceForm.bill_type === 1) {
        callback()
        this.$refs.invoiceForm.clearValidate(['express_no'])
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (this.invoiceForm.bill_type === 1 && !value) {
        return callback(new Error('请填写邮件地址'))
      } else if (this.invoiceForm.bill_type === 2) {
        callback()
        this.$refs.invoiceForm.clearValidate(['email'])
      } else {
        const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if (!reg.test(value)) {
          return callback(new Error('请输入正确的邮箱地址'))
        }
        callback()
      }
    }
    return {
      provinceList: [],
      cityList: [],
      areaList: [],
      visible: this.show,
      loading: false,
      invoiceForm: {
        pks: [],
        fee_type: 1,
        bill_vbillno: '',
        head_type: 2,
        head: '上海欣雅供应链管理有限公司',
        tax_num: '111111',
        bill_amount: '',
        bill_content: '*服务费',
        memo: '暂无',
        bill_type: 2,
        accept_contact: '',
        accept_man: '',
        province: '',
        city: '',
        area: '',
        address: '',
        email: '',
        wechat: '',
        qq_num: '',
        qrcode: '',
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
      formFlag: true,
      vbillno_list: [],
      vbillno: '',
      rules: {
        bill_vbillno: [
          { validator: checkBill, trigger: 'blur' }
        ],
        accept_man: [
          { validator: checkAcceptMan, trigger: 'blur' }
        ],
        accept_contact: [
          { validator: checkAcceptContact, trigger: 'blur' }
        ],
        province: [
          { validator: checkProvince, trigger: 'change' }
        ],
        city: [
          { validator: checkCity, trigger: 'change' }
        ],
        area: [
          { validator: checkArea, trigger: 'change' }
        ],
        address: [
          { validator: checkAddress, trigger: 'blur' }
        ],
        express_corp: [
          { validator: checkExpressCorp, trigger: 'change' }
        ],
        express_no: [
          { validator: checkExpressNo, trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show(val) {
      this.visible = val// 新增result的watch，监听变更并同步到myResult上
    },
    opinion(val) {
      // console.log(val)
      this.invoiceForm.pks = val.pk_list
      this.vbillno = val.vbillno.join()
      this.invoiceForm.bill_amount = val.price
    }

  },
  created() {
    this.provinceList = provinceCityArea
  },
  methods: {
    selectPro(item) {
      var _this = this
      _this.cityList = []
      _this.areaList = []
      _this.invoiceForm.city = ''
      _this.invoiceForm.area = ''
      for (var i = 0; i < _this.provinceList.length; i++) {
        if (item === _this.provinceList[i].region) {
          _this.cityList = _this.provinceList[i].child
          break
        }
      }
    },
    selectCity(item) {
      var _this = this
      _this.areaList = []
      _this.invoiceForm.area = ''
      for (var i = 0; i < _this.cityList.length; i++) {
        if (item === _this.cityList[i].region) {
          _this.areaList = _this.cityList[i].child
          break
        }
      }
    },
    close() {
      this.invoiceForm.head_type = 2
      this.invoiceForm.bill_type = 2
      this.$refs.invoiceForm.resetFields()
      this.$emit('update:show', false)
    },
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
    submitForm: Debounce(function() {
      var _this = this
      // debugger
      _this.$refs.invoiceForm.validate(valid => {
        if (valid) {
          // this.$parent.handleFilter()
          // debugger
          if (this.invoiceForm.fee_type === 1) {
            createBill(_this.invoiceForm).then(response => {
              if (response.data.success) {
                _this.$parent.handleFilter()
                _this.$message({
                  type: 'success',
                  message: '保存成功!',
                  duration: 5000
                })
                _this.visible = false
              } else {
                _this.$message({
                  type: 'warning',
                  message: response.data.msg,
                  duration: 5000
                })
              }
            })
          } else {
            payCreateBill(_this.invoiceForm).then(response => {
              if (response.data.success) {
                _this.$parent.handleFilter()
                _this.$message({
                  type: 'success',
                  message: '保存成功!',
                  duration: 5000
                })
                _this.visible = false
              } else {
                _this.$message({
                  type: 'warning',
                  message: response.data.msg,
                  duration: 5000
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }),
    billType(val) {
      console.log(val)
      this.formFlag = !this.formFlag
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
    padding: 10px 45px 10px 50px;

  }

}
</style>

<style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
