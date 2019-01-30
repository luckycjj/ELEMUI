<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <el-form ref="orderForm" :model="orderForm" label-width="80px">
        <div class="portlet light">
          <div class="note note-info">订单摘要</div>
          <div class="portlet-body form">
            <!-- BEGIN FORM-->
            <div class="form-body">
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">订单单号：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ orderForm.vbillno }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">运单状态：</el-col>
                    <el-col v-if="orderForm.entrust.length>0" :xs="17" :sm="17" :lg="17">
                      <router-link :to="'/ordercenter/track/'+orderForm.entrust[0].ent_vbillno" class="link-type" style="color:#409EFF;text-decoration:none">
                        <span >{{ changeStateType(orderForm.status) }}</span>
                      </router-link>
                    </el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">订单状态：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">
                      <span v-if="orderForm.pay_status=='待付款'" class="colol-red">{{ orderForm.pay_status }}</span>
                      <span v-else >{{ orderForm.pay_status }}</span>
                    </el-col>
                  </el-col>

                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="6" :sm="6" :lg="7" class="control-label">客户编号：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ orderForm.cust_orderno }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">支付时间：</el-col>
                    <el-col v-if="orderForm.pay_time" :xs="17" :sm="17" :lg="17">{{ orderForm.pay_time | parseTime('{y}-{m}-{d}') }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">承运商：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ orderForm.carr_name }}</el-col>
                  </el-col>

                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">  <el-col :xs="24" :sm="24" :lg="8">
                  <el-col :xs="7" :sm="7" :lg="7" class="control-label">对账号：</el-col>
                  <el-col :xs="17" :sm="17" :lg="17">
                    {{ orderForm.check_vbillno }}
                    <!-- <a v-if="orderForm.recon_no">（费用信息）</a> -->
                  </el-col>
                </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">到货时间：</el-col>
                    <el-col v-if="orderForm.arri_date" :xs="17" :sm="17" :lg="17" class="colol-red">{{ orderForm.arri_date | parseTime('{y}-{m}-{d}') }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">收货人：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">
                      {{ orderForm.arri_contact }}
                    </el-col>
                  </el-col>
                  <el-col v-if="orderForm.arri_contact_mobile" :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">联系手机：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">
                      {{ phoneReplace(orderForm.arri_contact_mobile) }}
                    </el-col>
                  </el-col>
                  <el-col v-if="orderForm.arri_contact_phone" :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">联系座机：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">
                      {{ orderForm.arri_contact_phone }}
                    </el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">总价：</el-col>
                    <el-col v-if="orderForm.contract_amount" :xs="17" :sm="17" :lg="17">
                      <span style="color:blue">¥{{ orderForm.contract_amount }}</span>
                      <span >(车费+过路费)</span>
                    </el-col>
                  </el-col>
                  <!-- <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">回单：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ orderForm.back_bill }}</el-col>
                  </el-col> -->
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group" >
                  <el-col :xs="24" :sm="24" :lg="12" style="margin-left:20px">
                    <el-col :xs="4" :sm="4" :lg="4" class="control-label">附件类型：</el-col>
                    <el-col :xs="20" :sm="20" :lg="20">

                      <el-badge :value="orderForm.deliveryImgCount" :hidden="orderForm.deliveryImgCount===0" class="item" >
                        <el-button size="small" @click="queryType('0')">提货</el-button>
                      </el-badge>

                      <el-badge :value="orderForm.arrivalImgCount" :hidden="orderForm.arrivalImgCount===0" class="item">
                        <el-button size="small" @click="queryType('1')">到货</el-button>
                      </el-badge>

                      <el-badge :value="orderForm.signatureTypeImgCount" :hidden="orderForm.signatureTypeImgCount===0" class="item">
                        <el-button size="small" @click="queryType('2')">签收</el-button>
                      </el-badge>
                      <el-badge :value="orderForm.receiptImgCount" :hidden="orderForm.receiptImgCount===0" class="item">
                        <el-button size="small" @click="queryType('3')">回单</el-button>
                      </el-badge>
                      <el-badge :value="orderForm.abnormalImgCount" :hidden="orderForm.abnormalImgCount===0" class="item">
                        <el-button size="small" @click="queryType('4')">异常反馈</el-button>
                      </el-badge>
                      <el-badge :value="orderForm.orderAttachmentCount" :hidden="orderForm.orderAttachmentCount===0" class="item">
                        <el-button size="small" @click="queryType('5')">附件</el-button>
                      </el-badge>
                    </el-col>
                  </el-col>
                </div>
              </el-row>

            </div>
            <div class="note note-info">货物信息</div>
            <el-table
              :data="orderForm.goods"
              :header-cell-style="getRowClass"
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
                :formatter="formatterWeight"
                prop="weight"
                label="重量(t)">
                <template slot-scope="scope">
                  <span>{{ changeFixed(scope.row.weight) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :formatter="formatterVolume"
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
            <div class="note note-info">运单信息</div>
            <div class="form-body">
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">提单号：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ orderForm.lad_no }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">运输方式：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ orderForm.trans_type_name }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">异常事件：</el-col>
                    <el-col v-if="orderForm.exp_num" :xs="17" :sm="17" :lg="17" class="colol-red">
                      <el-popover
                        v-if="orderForm.exp_num"
                        placement="top-start"
                        width="480"
                        trigger="click"
                        @show="expFlag(orderForm.entrust[0].ent_vbillno)"
                        @hide="hideExp()"
                      >
                        <p class="yichangP">异常信息</p>
                        <div class="messageBox">
                          <div v-for="(item,i) in expList" :key="i">
                            <div v-if="i === 0 || (i > 0 && lookMoreExp)" class="errormessage">
                              <h4><i class="el-icon-date" /> &nbsp;&nbsp;{{ item.create_time }}</h4>
                              <h4><i class="fa fa-warning font-red"/> &nbsp;&nbsp;{{ changeExp(item.exp_type) }}</h4>
                            </div>
                          </div>
                          <div v-if="expList.length > 0" class="peoplemessage">
                            <h4><i class="fa fa-user" /> &nbsp;&nbsp;{{ expList[0].driver_name }}</h4>
                            <h4><i class="el-icon-phone" /> &nbsp;&nbsp;{{ expList[0].mobile }}</h4>
                            <img src="../../../../static/car/tel.png">
                          </div>
                        </div>
                        <span v-if="expList.length > 1 && !lookMoreExp" @click="lookMoreExp = !lookMoreExp">查看全部</span>
                        <!-- <p>{{ scope.row.exp_flag }}</p> -->
                        <span slot="reference" >{{ orderForm.exp_num }}件</span>
                      </el-popover>
                    </el-col>
                  </el-col>
                </div>
              </el-row>
              <!-- <div class="form-group">
                <el-row v-for="(item,index) in orderForm.entrust" :key="index" :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="6">
                    <el-col :xs="6" :sm="6" :lg="6" class="control-label">运单号：</el-col>
                    <el-col :xs="18" :sm="18" :lg="18">{{ item.ent_vbillno }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="6">
                    <el-col :xs="10" :sm="10" :lg="10" class="control-label">重量(t)/体积(m³)：</el-col>
                    <el-col :xs="14" :sm="14" :lg="14">{{ item.ent_weight }}/{{ item.ent_volume }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="4">
                    <el-col :xs="6" :sm="6" :lg="8" class="control-label">件数：</el-col>
                    <el-col :xs="18" :sm="18" :lg="16">{{ item.ent_num }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="6">
                    <el-col :xs="6" :sm="6" :lg="6" class="control-label">车牌：</el-col>
                    <el-col :xs="18" :sm="18" :lg="10">{{ item.ent_car }}</el-col>
                    <router-link :to="'/operationCenter/track/'+item.ent_vbillno" class="link-type">
                      <span>跟踪</span>
                    </router-link>
                  </el-col>
                </el-row>
              </div> -->
            </div>
            <el-table
              :data="orderForm.entrust"
              :header-cell-style="getRowClass"
              border
              style="width: 100%;margin-bottom:20px">
              <el-table-column
                prop="ent_vbillno"
                label="运单号"/>
              <el-table-column
                prop="ent_weight"
                label="重量(t)/体积(m³)">
                <template slot-scope="scope">
                  <span>{{ changeItem1(scope.row.ent_weight) }}/{{ changeItem1(scope.row.ent_volume) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="ent_num"
                label="件数"/>
              <el-table-column
                prop="ent_car"
                label="车牌"/>
                <!-- <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <router-link :to="'/ordercenter/track/'+scope.row.ent_vbillno" class="link-type" style="color:blue">
                    <span style="font-weight:700;">跟踪</span>
                  </router-link>
                </template>
              </el-table-column> -->
            </el-table>
            <div class="note note-info">费用信息</div>
            <div style="margin:20px">收费明细</div>
            <el-table
              :data="revenueList"
              :header-cell-style="getRowClass"
              border
              style="width: 100%;margin-bottom:20px">
              <el-table-column
                prop="vbillstatus"
                label="状态"/>
              <el-table-column
                prop="expense_type"
                label="费目"/>
              <el-table-column
                prop="sub_fee"
                label="是否代收"/>
              <el-table-column
                prop="cost_amount"
                label="合计(元)">
                <template slot-scope="scope">
                  <span>{{ changeItem(scope.row.cost_amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="memo"
                label="备注"/>
              <el-table-column
                prop="create_user"
                label="创建人"/>
              <el-table-column
                prop="create_time"
                label="创建时间"/>
            </el-table>
      </div></div></el-form>
      <el-dialog
        :visible.sync="dialogVisible"
        title="附件"
        width="30%"
        @close="close">
        <!-- <el-row v-for="(item,i) in imgList" :key="i" >
          <img :src="ftpUrl+item" style="max-width:500px">
        </el-row> -->
        <el-table :data="list" border style="width: 100%" highlight-current-row>
          <el-table-column prop="originType" label="附件类型" min-width="80"/>
          <el-table-column prop="url" label="上传附件" min-width="150">
            <template slot-scope="scope">
              <span v-for="(item,i) in scope.row.url" :key="i">
                <el-popover
                  placement="bottom"
                  title=""
                  trigger="hover">
                  <img :src="ftpUrl+item" style="max-width:800px;max-height:600px">
                  <img slot="reference" :src="ftpUrl+item" :alt="item" class="imgSize" style="margin-right:5px">
                </el-popover>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import { parseTime } from '@/utils'
import { orderDetails, queryByVbillnoAndType } from '@/api/order'
import { findAbnormalEventByVbillno } from '@/api/entrust'
import { costInfo } from '@/api/settlement'
import { fixedList } from '@/utils/fixedNum'
export default {
  name: 'OrderDetails',
  components: { Tinymce, MDinput, Upload, parseTime },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      vbillno: '',
      orderForm: {
        pay_status: '', // 支付状态
        contract_no: '', // 合同号
        arri_contact_mobile: '', // 收货人电话
        carr_name: '', // 承运商名字
        goods: [], // 货品
        trans_type_name: '', // 运输方式
        pay_time: '', // 支付时间
        arri_date: '', // 到货时间
        recon_no: '', // 应收对账单号
        back_bill: '', // 回单
        contract_amount: '', // 总金额
        vbillno: '', // 订单号
        entrust: [], // 运单信息
        lad_no: '', // 提单号
        arri_contact: '', // 收货联系人
        exp_num: '', // 异常事件
        balatype: '', // 支付类型
        num: 0

      },
      revenueList: [],
      dialogVisible: false,
      imgList: [],
      ftpUrl: '',
      type: '',
      list: [],
      expList: [],
      lookMoreExp: false
    }
  },
  computed: {},
  created() {
    this.vbillno = this.$route.params.vbillno
    this.getOrderDetails()
    this.getCostInfo()
  },
  methods: {
    changeItem1(item) {
      return fixedList.fiexedThreeNum(Number(item))
    },
    changeItem(item) {
      return fixedList.fiexedTwoNum(Number(item))
    },
    phoneReplace(newValue) {
      if (newValue) {
        let value = newValue.replace(/\D/g, '').substring(0, 11)
        // console.log(value)

        value = `${value.substr(0, 3)}-${value.substr(3, 4)}-${value.substr(7)}`

        return value
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'color: black '
      } else {
        return ''
      }
    },
    // 获得订单详情
    getOrderDetails() {
      const data = { vbillno: this.vbillno }
      orderDetails(data).then(response => {
        this.orderForm = Object.assign({}, response.data.data)
        // console.log(response.data.data)
      })
    },
    // 转换重量格式
    formatterWeight(row, column) {
      return row.weight.toLocaleString()
    },
    // 转换体积格式
    formatterVolume(row, column) {
      return row.volume.toFixed(3)
    },
    getCostInfo() {
      const data = {
        invoice_vbillno: this.vbillno,
        userCode: '15001962939'
      }
      this.revenueList = []
      costInfo(data).then(response => {
        for (const item of response.data.data.costInfoVOs) {
          this.revenueList.push({
            'vbillstatus': this.changeState(item.vbillstatus),
            'expense_type': item.expense_type,
            'sub_fee': item.sub_fee,
            'memo': item.memo,
            'cost_amount': item.cost_amount,
            'create_user': item.create_user,
            'create_time': item.create_time
          })
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
    // changeStateType(item) {
    //   if (item === 0) {
    //     return '新建'
    //   } else if (item === 10) {
    //     return '已确认'
    //   } else if (item === 20) {
    //     return '司机发车'
    //   } else if (item === 30) {
    //     return '部分提货'
    //   } else if (item === 40) {
    //     return '已提货'
    //   } else if (item === 50) {
    //     return '部分到货'
    //   } else if (item === 60) {
    //     return '已到货'
    //   } else if (item === 70) {
    //     return '部分签收'
    //   } else if (item === 80) {
    //     return '已签收'
    //   } else if (item === 90) {
    //     return '已回单'
    //   } else if (item === 100) {
    //     return '关闭'
    //   } else if (item === 5) {
    //     return '已驳回'
    //   } else if (item === 15) {
    //     return '已派车'
    //   } else {
    //     return ''
    //   }
    // },
    changeStateType(item) {
      if (item === 0) {
        return '待确认'
      } else if (item === 10) {
        return '已确认'
      } else if (item === 20) {
        return '司机发车'
      } else if (item === 31) {
        return '提货到达'
      } else if (item === 32) {
        return '开始装货'
      } else if (item === 33) {
        return '装货完毕'
      } else if (item === 41) {
        return '运输到达'
      } else if (item === 42) {
        return '开始卸货'
      } else if (item === 43) {
        return '卸货完毕'
      } else if (item === 50) {
        return '已签收'
      } else if (item === 55) {
        return '已回单'
      } else if (item === 60) {
        return '退单'
      } else {
        return ''
      }
    },
    queryType(item) {
      // const data = {
      //   vbillno: this.vbillno,
      //   type: item
      // }
      this.list = []
      queryByVbillnoAndType({ vbillno: this.vbillno, type: item }).then(response => {
        if (response.data.success) {
          this.ftpUrl = response.data.data.ftpUrl
          this.imgList = response.data.data.url

          this.list.push({ 'originType': this.changeType(item), 'url': this.imgList })
          // console.log(this.imgList)
          this.$nextTick(() => {
            this.dialogVisible = true
          })
          // setTimeout(() => { this.dialogVisible = true }, 1000)
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg
          })
        }
      })
    },
    close() {
      this.ftpUrl = ''
      this.imgList = []
      this.list = []
      this.dialogVisible = false
    },
    changeType(type) {
      if (type === '0') {
        return '提货'
      } else if (type === '1') {
        return '到货'
      } else if (type === '2') {
        return '签收'
      } else if (type === '3') {
        return '回单'
      } else if (type === '4') {
        return '异常反馈'
      } else {
        return '附件'
      }
    },
    expFlag(item) {
      const data = {
        userCode: '15111111112',
        vbillno: item
      }
      findAbnormalEventByVbillno(data).then(response => {
        // console.log(response)
        const list = []
        for (var i = 0; i < response.data.datas.length; i++) {
          list.unshift(response.data.datas[i])
        }
        this.expList = list
        this.lookMoreExp = false
      })
    },
    hideExp() {
      this.expList = []
      this.lookMoreExp = false
    },
    changeExp(item) {
      if (item === 1) {
        return '货物破损'
      } else if (item === 4) {
        return '提货地址有误'
      } else if (item === 3) {
        return '时效异常'
      } else if (item === 10) {
        return '等待费'
      } else if (item === 8) {
        return '运费'
      } else if (item === 2) {
        return '货物错误'
      } else if (item === 0) {
        return '货物丢失'
      } else if (item === 6) {
        return '无人签收'
      } else if (item === 12) {
        return '收货地址有误'
      } else if (item === 9) {
        return '仓库费'
      } else if (item === 5) {
        return '无法提货'
      } else {
        return '其他'
      }
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
    .imgSize{
      height: 40px;
      max-width: 80px;
    }
    .item {
      margin-right: 10px;
      margin-top:5px;
    }
    .colol-red{
      color:red;
    }

  }
}
.messageBox{
    position: relative;
  }
  .yichangP{
     text-align: center;
     font-size: 18px;
    color:#666666;
    line-height: 26px;
    margin: 0;
  }
  .peoplemessage{
    width:200px;
    padding:0px 10px;
    position: absolute;
    margin-top: -43.92px;
    right:0;
    top:50%;
  }
  .errormessage{
    width:240px;
    padding:0px 10px;
    position: relative;
  }
  .peoplemessage img{
    width : 50px;
    position: absolute;
    top:50%;
    margin-top: -25px;
    right:15px;
    cursor: pointer;
  }
  .peoplemessage h4,.errormessage h4{
     font-size: 13px;
    font-weight: normal;
  }
</style>
