
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
      style="width: 100%;">
      <el-table-column type="selection" min-width="55" />
      <el-table-column align="center" prop="priority" label="优先级" width="80">
        <template slot-scope="scope">
          <i v-if="scope.row.priority=='Y'" class="fa fa-bolt font-red font-lg"/>
          <i v-if="scope.row.priority=='N'" class="fa fa-bolt font-grey font-lg"/>
        </template>
      </el-table-column>
      <el-table-column prop="vbillstatus" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.vbillstatus=='已确认'" class="font-green">{{
          scope.row.vbillstatus }}</span>
          <span v-else>{{ scope.row.vbillstatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="exp" align="center" label="异常事件" width="80">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.exp==='Y'"
            placement="right"
            width="480"
            trigger="hover"
            @show="expFlag(scope.row.vbillno)"
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
            <i slot="reference" class="fa fa-warning font-red"/>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="vbillno" label="订单编号" min-width="180"/>
      <!-- <el-table-column prop="vbillno" label="订单编号" min-width="160">
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
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <!-- <a href="editorder.html">编辑</a> -->
          <router-link v-if="checkPermission(['tms.order.detail'])" :to="'/ordercenter/order-details/'+scope.row.vbillno" class="link-type">
            <span>详情</span>
          </router-link>
          <span v-if="checkPermission(['tms.order.cost'])" style="font-size:16px;">|</span>
          <el-button v-if="checkPermission(['tms.order.cost'])" type="text" @click="editReceCost(scope.row.vbillno)">费用</el-button>
          <!-- <el-button type="text" @click="dialogAttachmentVisible = true">附件</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="page-operation-bottons">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" style="float:right;margin-top:0;background-color: #f5f8fd;" @pagination="getList" />
    </div>

    <!-- <upload-attachment :show.sync="dialogAttachmentVisible" :onselect="selectUpload"/> -->
    <rece-cost v-if="checkPermission(['tms.order.cost'])" ref="rececost" :show.sync="dialogFormVisible" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { fetchList } from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import EnumType from '@/constants/enumType'
import UploadAttachment from '@/components/UploadAttachment'
import ReceCost from './ReceCost'
import checkPermission from '@/utils/permission' // 权限判断函数
import { findAbnormalEventByVbillno } from '@/api/entrust'
export default {
  name: 'ShippedOrder',
  components: { Pagination, UploadAttachment, ReceCost },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        userCode: '15001962939',
        type: 2,
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
      isCriteriaMore: false,
      dialogAttachmentVisible: false,
      vbillstatusOptions: EnumType.vbillstatusShipOptions,
      pk_trans_typeOptions: EnumType.pk_trans_typeOptions,
      innerHeight: document.body.innerHeight,
      dialogFormVisible: false,
      expList: [],
      lookMoreExp: false
    }
  },
  computed: {
    tableHeight() {
      return innerHeight - 410
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
    getList() {
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
    selectUpload(selection) {
      // console.log(selection)
      for (const item of selection) {
        this.postForm.attamentDto.push({ 'originType': this.changeType(item.originType),
          'url': item.url
        })
      }
    },
    changeType(type) {
      if (type === '提货') {
        return 0
      } else if (type === '到货') {
        return 1
      } else if (type === '签收') {
        return 2
      } else if (type === '回单') {
        return 3
      } else {
        return 4
      }
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
    },
    expFlag(item) {
      const data = {

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
    }
  }
}
</script>
<style scoped>
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
