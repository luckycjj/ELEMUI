
<template>
  <div>
    <div class="filter-container">
      <el-input v-model.trim="listQuery.vbillno" placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model.trim="listQuery.custOrderno" placeholder="客户编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.vbillstatus" placeholder="订单状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in vbillstatusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.startTime"
        type="date"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="下单开始日期"/>
      <el-date-picker
        v-model="listQuery.endTime"
        type="date"
        size="medium"
        style="width: 200px;"
        class="filter-item"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="下单结束日期"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
      <el-collapse-transition>
        <div v-show="isCriteriaMore">
          <el-input v-model.trim="listQuery.goods_name" placeholder="货物名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-select v-model="listQuery.pk_trans_type" placeholder="运输方式" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in pk_trans_typeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
          <el-input v-model.trim="listQuery.delivery" placeholder="提货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-input v-model.trim="listQuery.arrival" placeholder="卸货地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        </div>
      </el-collapse-transition>
    </div>
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
      <el-table-column type="selection" min-width="55" />
      <el-table-column align="center" prop="priority" label="优先级" width="80">
        <template slot-scope="scope">
          <i v-if="scope.row.priority=='Y'" class="fa fa-bolt font-red font-lg"/>
          <i v-if="scope.row.priority=='N'" class="fa fa-bolt font-grey font-lg"/>
        </template>
      </el-table-column>
      <el-table-column prop="vbillstatus" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.vbillstatus=='已确认'" class="font-green">{{ scope.row.vbillstatus }}</span>
          <span v-else>{{ scope.row.vbillstatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="vbillno" label="订单编号" min-width="180"/>
      <!-- <el-table-column prop="vbillno" label="订单编号" min-width="180">
        <template slot-scope="scope">
          <router-link :to="'/ordercenter/order-details/'+scope.row.vbillno" class="link-type">
            <span>{{ scope.row.vbillno }}</span>
          </router-link>
        </template>
      </el-table-column> -->
      <el-table-column prop="custOrderno" label="客户编号" min-width="120"/>
      <el-table-column prop="pk_trans_type" label="运输方式" min-width="120"/>
      <el-table-column prop="ent_date" label="下单日期" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.ent_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deli_address" label="提货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="arri_address" label="卸货地址" min-width="300" show-overflow-tooltip/>
      <el-table-column prop="carr_name" label="承运商" min-width="180"/>
      <el-table-column prop="goods_name" label="货物名称" min-width="120" show-overflow-tooltip/>
      <el-table-column prop="num" label="总件数" min-width="120"/>
      <el-table-column prop="weight" label="总重量(t)" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeFixed(scope.row.weight) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="总体积(m³)" min-width="120">
        <template slot-scope="scope">
          <span>{{ changeFixed(scope.row.volume) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="140">
        <template slot-scope="scope">
          <!-- <a href="editorder.html">编辑</a> -->
          <el-row v-if="scope.row.vbillstatus=='新建'&&scope.row.pk_invoice_type=='PC'">
            <router-link :to="'/orderCenter/edit-order/'+scope.row.vbillno" class="link-type">
              <span >编辑</span>
            </router-link>
            <span style="font-size:16px;">|</span>
            <el-button type="text" @click="editAttachment(scope.row.vbillno)">附件</el-button>
            <span style="font-size:16px;">|</span>
            <el-button type="text" @click="editReceCost(scope.row.vbillno)">费用</el-button>
          </el-row>
          <el-row v-else >
            <router-link v-if="checkPermission(['tms.order.detail'])" :to="'/ordercenter/order-details/'+scope.row.vbillno" class="link-type">
              <span >详情</span>
            </router-link>
            <span v-if="checkPermission(['tms.order.detail'])" style="font-size:16px;">|</span>
            <el-button type="text" @click="editAttachment(scope.row.vbillno)">附件</el-button>
            <span v-if="checkPermission(['tms.order.cost'])" style="font-size:16px;">|</span>
            <el-button v-if="checkPermission(['tms.order.cost'])" type="text" @click="editReceCost(scope.row.vbillno)">费用</el-button>
          </el-row>
          <!-- <router-link :to="'/orderCenter/edit-order/'+scope.row.vbillno" class="link-type">
            <span>编辑</span>
          </router-link>
          <el-button type="text" @click="editAttachment(scope.row.vbillno)">附件</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="page-operation-bottons">
      <el-row>
        <router-link :to="'/orderCenter/add-order'">
          <el-button class="change-btn" icon="el-icon-plus">新增</el-button>
        </router-link>
        <el-button class="confrim-btn" icon="el-icon-success" style="margin-left:10px;" @click="confirmInvoice">确认</el-button>
        <el-button class="cancel-btn" icon="el-icon-delete" @click="cancleSegment">作废</el-button>
        <el-button class="port-btn" icon="el-icon-upload2" @click="dialogUploadExcel=true">导入</el-button>
        <el-button class="port-btn" icon="el-icon-download" @click="exportInvoice">导出</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" style="float:right;margin-top:0;background-color: #f5f8fd;" @pagination="getList" />
      </el-row>
    </div>
    <look-attachment :show.sync="dialogAttachmentVisible" :opinion="attamentDto"/>
    <rece-cost v-if="checkPermission(['tms.order.cost'])" ref="rececost" :show.sync="dialogFormVisible" />
    <el-dialog :visible.sync="dialogUploadExcel" title="导入订单" width="400px">
      <upload-excel-component ref="uploadExcel" :after-success="getList"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadExcel = false">取 消</el-button>
        <el-button type="primary" @click="handleUploadSuccess">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import EnumType from '@/constants/enumType'
import { fetchList, cancleOrder, confirmOrder } from '@/api/order'
import { receiptList } from '@/api/entrust'
import { exportInvoice } from '@/api/poi'
import waves from '@/directive/waves' // Waves directive
import LookAttachment from '@/components/LookAttachment'
import UploadExcelComponent from './UploadExcel.vue'
import { parseTime } from '@/utils'
import moment from 'moment'
import ReceCost from './ReceCost'
import checkPermission from '@/utils/permission' // 权限判断函数
// import axios from 'axios'
export default {
  name: 'OutstandingOrder',
  components: { Pagination, parseTime, LookAttachment, UploadExcelComponent, ReceCost },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        userCode: '15001962939',
        type: 1,
        vbillno: '',
        custOrderno: '',
        vbillstatus: '',
        goods_name: '',
        delivery: '',
        arrival: '',
        pk_trans_type: '',
        startTime: '',
        endTime: '',
        cust_deli_no: '',
        pageNum: 1,
        pageSize: 10
      },
      dialogAttachmentVisible: false,
      dialogUploadExcel: false,
      isCriteriaMore: false,
      multipleSelection: [],
      vbillstatusOptions: EnumType.vbillstatusOptions,
      pk_trans_typeOptions: EnumType.pk_trans_typeOptions,
      innerHeight: document.body.innerHeight,
      attachment: [],
      vbillno: '',
      dialogFormVisible: false
    }
  },
  computed: {
    tableHeight() {
      return innerHeight - 410
    },
    attamentDto() {
      return this.attachment
    }
  },
  watch: {
    innerHeight(val) {
      if (!this.timer) {
        this.innerHeight = val
        this.timer = true
        const that = this
        setTimeout(function() {
          // console.log(that.innerHeight)
          that.init()
          that.timer = false
        }, 400)
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  methods: {
    checkPermission,
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      // debugger
      if (this.listQuery.startTime && this.listQuery.endTime) {
        if (this.listQuery.startTime > this.listQuery.endTime) {
          this.$message({
            type: 'warning',
            message: '开始日期不能超过结束日期!'
          })
          return false
        }
      }
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.datas
        this.total = response.data.data.totalCount || 0

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    cancleSegment() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请先勾选所需条目!'
        })
        return false
      }
      this.$confirm('此操作将作废该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const selectRowNos = []
        this.multipleSelection.forEach((item, index, arr) => {
          selectRowNos.push(item.vbillno)
        })
        cancleOrder({ vbillno: selectRowNos.join() }).then(response => {
          this.multipleSelection.forEach((item, index, arr) => {
            const i = this.list.indexOf(item)
            this.list.splice(i, 1)
          })
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
        })
      })
    },
    confirmInvoice() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请先勾选所需条目!'
        })
        return false
      }
      const selectState = []
      this.multipleSelection.forEach((item, index, arr) => {
        selectState.push(item.vbillstatus)
      })
      for (const item of selectState) {
        if (item === '已确认') {
          this.$message({
            type: 'warning',
            message: '订单已确认!'
          })
          return false
        }
        continue
      }
      this.$confirm('此操作将确认该记录, 是否确认?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const selectRowNos = []
        this.multipleSelection.forEach((item, index, arr) => {
          selectRowNos.push(item.vbillno)
        })
        var confirmJson = {
          vbillno: selectRowNos.join(),
          userCode: '15001962939'
        }
        confirmOrder(confirmJson).then(response => {
          // debugger
          if (response.data.success) {
            this.multipleSelection.forEach((item, index, arr) => {
              item.vbillstatus = EnumType.vbillstatusOptions[1].display_name
            })
            this.$message({
              type: 'success',
              message: '确认成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'warning',
              message: '操作失败!' + response.data.msg
            })
          }
        })
      })
    },
    exportInvoice() {
      exportInvoice(this.listQuery).then(response => {
        // debugger
        const fileName = '未派单' + moment(new Date()).format('YYYYMMDDhhmmss') + '.xls'
        // 获取文件名
        const objectUrl = URL.createObjectURL(new Blob([response.data], { type: response.headers['Content-Type'] }))

        const a = document.getElementById('download_a')
        a.href = objectUrl
        a.download = fileName
        a.click()
        URL.revokeObjectUrl(a.href)
        // 文件地址
        // const link = document.createElement('a')
        // link.download = fileName
        // link.href = objectUrl
        // link.click()
        // URL.revokeObjectUrl(link.href)
      })
    },
    handleUploadSuccess() {
      this.$refs.uploadExcel.submitUpload()
      // this.dialogUploadExcel = false
    },
    resetForm() {
      this.listQuery.vbillno = ''
      this.listQuery.custOrderno = ''
      this.listQuery.vbillstatus = ''
      this.listQuery.goods_name = ''
      this.listQuery.pk_trans_type = ''
      this.listQuery.delivery = ''
      this.listQuery.arrival = ''
      this.getList()
    },
    // selectUpload(selection) {
    //   console.log(selection)
    //   var atta = []
    //   for (const item of selection) {
    //     atta.push({ 'originType': this.changeType(item.originType),
    //       'url': item.url
    //     })
    //   }
    //   const data = {
    //     userCode: '13162095658',
    //     invoiceVbillno: this.vbillno,
    //     attamentDto: atta
    //   }
    //   saveReceipt(data).then(response => {
    //     if (response.data.success) {
    //       this.$message({
    //         type: 'success',
    //         message: '上传成功!'
    //       })
    //     } else {
    //       this.$message({
    //         type: 'warning',
    //         message: '上传失败!' + response.data.msg
    //       })
    //     }
    //   })
    // },
    changeType(type) {
      if (type === '提货' || type === '0') {
        return '0'
      } else if (type === '到货' || type === '1') {
        return '1'
      } else if (type === '签收' || type === '2') {
        return '2'
      } else if (type === '回单' || type === '3') {
        return '3'
      } else {
        return '4'
      }
    },
    editAttachment(item) {
      this.attachment = []
      this.vbillno = item
      const data = {
        userCode: '13162095658',
        invoiceVbillno: item
      }
      // debugger
      var that = this
      receiptList(data).then(response => {
        // console.log(response.data)
        for (const item of response.data.data.ReceiptVo) {
          that.attachment.push({ 'originType': that.changeType(item.origin_type.toString()),
            'url': item.url
          })
        }

        that.$nextTick(() => {
          that.dialogAttachmentVisible = true
        })
      })
    },
    editReceCost(item) {
      this.$refs.rececost.getCostInfo(item)
      this.$nextTick(() => {
        this.dialogFormVisible = true
      })
    },
    changeFixed(item) {
      if (item !== '' || item !== undefined || item !== null) {
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
.box{
  border: 1px solid #60aee4;
  border-top: 0;
    .blue{
       background-color: #3598dc;
       border-top: 0;
       border-bottom: 0;
       padding: 0 10px;
       margin-bottom: 0;
       color: #fff;
    }
    .btnGreen{
      margin: 10px;
      color: #fff;
      background-color: #32c5d2;
      border-color: #32c5d2;
    }
}

</style>
