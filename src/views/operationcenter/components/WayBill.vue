<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <el-form ref="postForm" :model="postForm" label-width="80px">
        <div class="portlet light">
          <div class="note note-info">
            <span>运单信息</span>
            <span class="link-type" style="margin-left:50px" @click="costDetail(postForm.vbillno)">费用信息</span>
            <!-- <span class="link-type" style="margin-left:20px" @click="returnTopRevenue">新增-费用信息-收</span>
            <span class="link-type" style="margin-left:20px" @click="returnTopPay">新增-费用信息-付</span> -->
          </div>
          <div class="portlet-body form">
            <div class="form-body">
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">运单编号：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.vbillno }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">托单编号：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.segment_vbillno }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">订单编号：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.invoice_vbillno }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">运单状态：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.vbillstatus }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">提货日期：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.req_deli_date }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">到货日期：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.req_arri_date }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">运输方式：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.pk_trans_type }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">实际提货日期：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.act_deli_date }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">实际到货日期：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.act_arri_date }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">承运商：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.carr_name }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">车牌：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.carno }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">车型：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.car_model }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">

                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">总重量(t)：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ changeFixed(postForm.weight_count) }}</el-col>

                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">总件数：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.num_count }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">

                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">总体积(m³)：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ changeFixed(postForm.volume_count) }}</el-col>

                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">紧急程度：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.urgent_level }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">结算方式：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.balatype }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">备注：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.memo }}</el-col>
                  </el-col>
                </div>
              </el-row>
            </div>
          </div>
          <div class="note note-info">发货信息</div>
          <div class="portlet-body form">
            <div class="form-body">
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">发货方：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.pk_delivery }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">提货地址：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.deli_detail_addr }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">联系人：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.deli_contact }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">联系座机：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.deli_phone }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">联系手机：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.deli_mobile }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">备注：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.deli_process }}</el-col>
                  </el-col>
                </div>
              </el-row>
            </div>
          </div>
          <div class="note note-info">收货信息</div>
          <div class="portlet-body form">
            <div class="form-body">
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">收货方：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.pk_arrival }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">收货地址：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.arri_detail_addr }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">联系人：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.arri_contact }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">联系座机：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.arri_phone }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">联系手机：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.arri_mobile }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="8" :sm="8" :lg="8" class="control-label">备注：</el-col>
                    <el-col :xs="16" :sm="16" :lg="16">{{ postForm.arri_process }}</el-col>
                  </el-col>
                </div>
              </el-row>

            </div>
          </div>
          <div class="note note-info">货物信息</div>
          <el-table
            :data="postForm.goodsInfoDtoList"
            border
            style="width: 100%;margin-bottom:20px">
            <el-table-column
              prop="goods_code"
              label="货品编码"/>
            <el-table-column
              prop="goods_name"
              label="货品名称"
              min-width="160"/>
            <!-- <el-table-column
              prop="type"
              label="货品类型"/> -->
            <el-table-column
              prop="num"
              label="件数"/>
            <el-table-column
              prop="weight"
              label="重量(kg)">
              <template slot-scope="scope">
                <span>{{ changeFixed(scope.row.weight) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="volume"
              label="体积(m³)">
              <template slot-scope="scope">
                <span>{{ changeFixed(scope.row.volume) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pack"
              label="包装单位"/>
          </el-table>
        </div>
        <cost-info ref="costinfo" :show.sync="dialogFormVisible" :onselect="selectCostInfo"/>
      </el-form>
    </div>
  </div>
</template>
<script>
import CostInfo from '@/components/CostInfo'
import { waybillDetail } from '@/api/entrust'
// import EnumType from '@/constants/enumType'

export default {
  name: 'WayBill',
  components: { CostInfo },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: {
        invoiceBaseDto: {
          pk_trans_type: '', // 运输方式
          req_deli_date: '', // 提货日期
          req_arri_date: '', // 到货日期
          goods_name: '', // 货品名称
          car_length: '', // 车长
          car_model: '', // 车型
          weight_count: '', // 总重量
          num_count: '', // 总件数
          volume_count: '', // 总体积
          contract_amount: 0, // 合同总额
          amount: 0, // 货物总价值
          insurance_amount: 0, // 保险总金额
          balatype: '', // 结算方式
          if_urgent: '', // 是否加急
          if_back_bill: '',
          special_req: '', // 特殊要求
          trans_type: 1,
          if_insurance: '', // 是否保险
          wait_fee: '',
          other_fee: '',
          pk_carrier: '', // 提货方
          bala_carrier: '',
          ent_customer: '', // 委托客户
          vbillno: '', // 订单单号
          custOrderno: '',
          handlingCode: '' // 增值服务
        },
        deliInfoDto: {
          pk_delivery: '', // 发货方
          deli_province: '', // 提货省份
          deli_city: '', // 提货城市
          deli_area: '', // 提货区域
          deli_detail_addr: '', // 提货详细地址
          deli_contact: '', // 提货联系人
          deli_phone: '', // 提货座机
          deli_mobile: '', // 提货手机
          deli_memo: '' // 提货备注
        },
        arriInfoDto: {
          pk_arrival: '', // 到货方
          arri_contact: '', // 到货联系人
          arri_phone: '', // 到货电话
          arri_mobile: '', // 到货手机
          arri_province: '', // 到货省份
          arri_city: '', // 到货城市
          arri_area: '', // 到货区域
          arri_detail_addr: '', // 到货详细地址
          arri_memo: '' // 到货备注
        },
        userCode: '15001962939',
        goodsInfoDtoList: [],
        attamentDto: []
      },
      goods: [],
      dialogFormVisible: false
    }
  },
  computed: {
  },
  watch: {

  },
  created() {
    this.vbillno = this.$route.params.vbillno
    this.getWaybillDetails()
  },
  mounted() {

  },
  methods: {
    // 获得运单详情
    getWaybillDetails() {
      const data = {
        vbillno: this.vbillno,
        userCode: '15111111112' }
      waybillDetail(data).then(response => {
        this.postForm = Object.assign({}, response.data.data)
        if (this.postForm.pk_trans_type === '5fda0edc8df34b4d8c1ed44a6f1f866e') {
          this.$set(this.postForm, 'pk_trans_type', '整车运输')
        } else {
          this.$set(this.postForm, 'pk_trans_type', '零担运输')
        }
        if (this.postForm.balatype === 1) {
          this.$set(this.postForm, 'balatype', '现结')
        } else if (this.postForm.balatype === 0) {
          this.$set(this.postForm, 'balatype', '月结')
        } else {
          this.postForm.balatype = ''
        }
        if (this.postForm.urgent_level === 1) {
          this.$set(this.postForm, 'urgent_level', '紧急')
        } else if (this.postForm.urgent_level === 0) {
          this.$set(this.postForm, 'urgent_level', '普通')
        } else {
          this.postForm.urgent_level = ''
        }
        if (this.postForm.vbillstatus === 0) {
          this.$set(this.postForm, 'vbillstatus', '待确认')
        } else if (this.postForm.vbillstatus === 10) {
          this.$set(this.postForm, 'vbillstatus', '已确认')
        } else if (this.postForm.vbillstatus === 20) {
          this.$set(this.postForm, 'vbillstatus', '司机出发')
        } else if (this.postForm.vbillstatus === 31) {
          this.$set(this.postForm, 'vbillstatus', '提货到达')
        } else if (this.postForm.vbillstatus === 32) {
          this.$set(this.postForm, 'vbillstatus', '开始装货')
        } else if (this.postForm.vbillstatus === 33) {
          this.$set(this.postForm, 'vbillstatus', '装货完毕')
        } else if (this.postForm.vbillstatus === 41) {
          this.$set(this.postForm, 'vbillstatus', '运输到达')
        } else if (this.postForm.vbillstatus === 42) {
          this.$set(this.postForm, 'vbillstatus', '开始卸货')
        } else if (this.postForm.vbillstatus === 43) {
          this.$set(this.postForm, 'vbillstatus', '卸货完毕')
        } else if (this.postForm.vbillstatus === 50) {
          this.$set(this.postForm, 'vbillstatus', '已签收')
        } else if (this.postForm.vbillstatus === 55) {
          this.$set(this.postForm, 'vbillstatus', '已回单')
        } else if (this.postForm.vbillstatus === 60) {
          this.$set(this.postForm, 'vbillstatus', '退单')
        } else {
          this.postForm.vbillstatus = ''
        }
        // console.log(response.data)
      })
    },
    selectCostInfo() {},
    costDetail(data) {
      this.$refs.costinfo.getCostInfo(data)
      this.$nextTick(() => {
        this.dialogFormVisible = true
      })
    },
    changeFixed(item) {
      if (item) {
        return item.toFixed(3)
      } else {
        return '0.000'
      }
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
    padding: 20px;
    .bold {
      font-weight: 700;
      font-size: 16px;
    }
    .form-body {
      padding: 20px;
      .form-group {
        line-height: 40px;
        .control-label {
          text-align: right;
        }
        a{
            color: #337ab7;
            text-decoration: underline
        }
      }
    }
    .note.note-info {
    background-color: #f5f8fd;
    border-color: #8bb4e7;
    color: #010407;
    }
    .note {
    padding: 15px 30px 15px 15px;
    border-left: 5px solid #eee;
    border-radius: 0 4px 4px 0;
    }
    .btnGreen {
      margin-left: 10px;
      color: #fff;
      background-color: #32c5d2;
      border-color: #32c5d2;
    }
  }
}
</style>
