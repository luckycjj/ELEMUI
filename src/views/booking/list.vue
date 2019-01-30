<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.vbillno" placeholder="运单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.vbillno" placeholder="预约号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.vbillno" placeholder="目的地" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.vbillno" placeholder="操作人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="isCriteriaMore = !isCriteriaMore">更多条件<i class="el-icon-arrow-down el-icon--right"/></el-button>
      <el-collapse-transition>
        <div v-show="isCriteriaMore">
          <el-date-picker
            v-model="listQuery.startTime"
            type="date"
            size="medium"
            style="width: 200px;"
            class="filter-item"
            value-format="yyyy-MM-dd"
            placeholder="预约开始日期"/>
          <el-date-picker
            v-model="listQuery.endTime"
            type="date"
            size="medium"
            style="width: 200px;"
            class="filter-item"
            value-format="yyyy-MM-dd"
            placeholder="预约结束日期"/>
          <el-date-picker
            v-model="listQuery.startTime"
            type="date"
            size="medium"
            style="width: 200px;"
            class="filter-item"
            value-format="yyyy-MM-dd"
            placeholder="月台开始日期"/>
          <el-date-picker
            v-model="listQuery.endTime"
            type="date"
            size="medium"
            style="width: 200px;"
            class="filter-item"
            value-format="yyyy-MM-dd"
            placeholder="月台结束日期"/>
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
      style="width: 100%;">
      <el-table-column type="selection" min-width="55" />
      <el-table-column prop="status" label="预约状态" min-width="80"/>
      <el-table-column prop="bookingno" label="预约单号" min-width="200"/>
      <el-table-column prop="vbillno" label="运单号" min-width="180"/>
      <el-table-column prop="smsstatus" label="短信状态" min-width="120"/>
      <el-table-column prop="yuetai" label="月台" min-width="120"/>
      <el-table-column prop="goods_name" label="货物名称" min-width="300"/>
      <el-table-column prop="deli_address" label="出发地址" min-width="300"/>
      <el-table-column prop="arri_address" label="到达地址" min-width="120"/>
      <el-table-column prop="startdata" label="入月台时间" min-width="250"/>
      <el-table-column prop="enddata" label="离月台时间" min-width="250"/>
      <el-table-column prop="num_count" label="件数" min-width="120"/>
      <el-table-column prop="weight_count" label="重量（t）" min-width="120"/>
      <el-table-column prop="value_count" label="重量（t）" min-width="120"/>
      <el-table-column prop="drivername" label="司机名称" min-width="300"/>
      <el-table-column prop="platenumber" label="车牌号" min-width="300"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <upload-attachment :show.sync="dialogAttachmentVisible" :onselect="selectUpload"/>
    <div class="page-operation-bottons">
      <el-row>
        <el-button type="primary" icon="el-icon-download" @click="exportEntrust">预约新增</el-button>
        <el-button type="primary" icon="el-icon-download" @click="exportEntrust">作废</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { findEntrustList } from '@/api/entrust'
import waves from '@/directive/waves' // Waves directive\
export default {
  name: 'BookingList',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        userCode: '15111111112',
        optionType: '4',
        vbillno: '',
        entrustState: '',
        goodsName: '',
        deliAddr: '',
        arriAddr: '',
        transportType: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      },
      isCriteriaMore: false,
      innerHeight: document.body.innerHeight
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.list = [{
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }, {
        status: '成功',
        bookingno: 'RSO18120218988',
        vbillno: 'TRS8989898',
        smsstatus: '已发',
        yuetai: '月台1',
        goods_name: '原油1',
        deli_address: '上海-浦东',
        arri_address: '上海-青浦',
        startdata: '2018-12-12上午10：00',
        enddata: '2018-12-12中午12：00',
        num_count: '12',
        weight_count: '234.45',
        value_count: '2324',
        drivername: '张三',
        platenumber: '沪A8989'
      }]
      this.total = 20
      this.listLoading = false
      // findEntrustList(this.listQuery).then(response => {
      //   this.list = response.data.records
      //   this.total = response.data.totalRecords
      //   // Just to simulate the time of the request
      //   this.listLoading = false
      // })
    }
  }
}
</script>
