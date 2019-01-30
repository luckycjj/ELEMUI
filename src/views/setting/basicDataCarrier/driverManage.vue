<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.driverName" placeholder="司机名称" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.mobile" placeholder="手机号" style="width: 200px;" class="filter-item"/>
      <el-select v-model="listQuery.driverStatus" clearable class="filter-item" placeholder="选择司机状态" style="width: 200px;">
        <el-option
          v-for="item in driver_state"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.driverType" clearable class="filter-item" placeholder="选择司机类型" style="width: 200px;">
        <el-option
          v-for="item in driver_type"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
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
      <el-table-column type="selection" min-width="55"/>
      <el-table-column prop="driverCode" label="司机编号" min-width="100">
        <template slot-scope="scope">
          <span style="color:#409EFF" @click="addNew(2,scope.row.pkDriver)">{{ scope.row.driverCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkStatus" label="审核状态" min-width="80"/>
      <el-table-column prop="driverName" label="司机名称" min-width="90"/>
      <el-table-column prop="mobile" label="手机号" min-width="130"/>
      <el-table-column prop="driverType" label="司机类型" min-width="80"/>
      <el-table-column prop="driverStatus" label="司机状态" min-width="80" show-overflow-tooltip/>
      <el-table-column prop="licYears" label="有效期限" min-width="80">
        <template slot-scope="scope">
          <p v-if="scope.row.licYears!=null||scope.row.licYears!=undefined||scope.row.licYears!=''">{{ scope.row.licYears }}年</p>
        </template>
      </el-table-column>
      <el-table-column prop="licType" label="准驾车型" min-width="80"/>
      <el-table-column prop="id" label="身份证号" min-width="180"/>
      <el-table-column prop="idValidDate" label="身份证有效日期" min-width="200">
        <template slot-scope="scope">
          <p>{{ scope.row.idValidDate | idValid }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="licCode" label="驾驶证编号" min-width="100"/>
      <el-table-column prop="licTime" label="初次领证日期" min-width="120"/>
      <el-table-column prop="createTime" label="录入时间" min-width="180"/>
      <el-table-column prop="createUser" label="录入人" min-width="100"/>
      <el-table-column prop="lockedFlag" label="是否失效" min-width="90">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.lockedFlag"
            active-value="Y"
            inactive-value="N"
            @change="lockedFlag(scope.row.pkDriver,scope.row.lockedFlag)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="addNew(1,scope.row.pkDriver)">编辑</el-button>
          <span style="font-size:16px;">|</span>
          <el-button type="text" @click="dele(1,scope.row.pkDriver)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-operation-bottons">
      <el-row>
        <el-button class="change-btn" icon="el-icon-plus" @click="addNew(0)">新增</el-button>
        <el-button class="cancel-btn" icon="el-icon-delete" @click="dele(2)" >删除</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" class="page-style" @pagination="getList" />
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import { driverList, deleteDriver, updateDriver } from '@/api/setting'
export default {
  name: 'DriverManage',
  components: { Pagination },
  directives: { waves },
  filters: {
    idValid(val) {
      return val === '' || val === undefined ? '' : val.replace('&', '至')
    }
  },
  data() {
    return {
      driver_state: [{
        value: '0',
        label: '空闲'
      }, {
        value: '1',
        label: '出车中'
      }, {
        value: '2',
        label: '请假'
      }],
      driver_type: [{
        value: '1',
        label: '自有司机'
      }, {
        value: '2',
        label: '社会司机'
      }],
      list: [],
      total: 0,
      listLoading: false,
      startendTime: '',
      multipleSelection: [],
      tableKey: 0,
      listQuery: {
        driverName: '', // 司机姓名
        mobile: '', // 司机电话
        driverStatus: '', // 司机状态
        driverType: '', // 司机类型
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    tableHeight() {
      return innerHeight - 430
    }
  },
  created() {
    this.getList()
  },
  methods: {
    lockedFlag(code, doub) {
      updateDriver({
        pkDriver: code,
        lockedFlag: doub
      }).then(response => {
      })
    },
    getList() {
      this.listLoading = true
      driverList(this.listQuery).then(response => {
        this.list = response.data.records

        this.total = response.data.totalRecords || 0
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetForm() {
      this.listQuery.driverName = ''
      this.listQuery.mobile = ''
      this.listQuery.driverStatus = ''
      this.listQuery.driverType = ''
      this.listQuery.pageNum = 1
      this.getList()
    },
    addNew(type, number) {
      var _this = this
      if (type === 0) {
        _this.$router.push({ path: '/lookDriverMessage/new', query: { type: type }})
      } else if (type === 1) {
        _this.$router.push({ path: '/lookDriverMessage/' + number, query: { type: type }})
      } else if (type === 2) {
        _this.$router.push({ path: '/lookDriverMessage/' + number, query: { type: type }})
      }
    },
    time() {
      var date = new Date()
      return date.getFullYear() + '-' + this.ten(date.getMonth() + 1) + '-' + this.ten(date.getDate()) + ' ' + this.ten(date.getHours()) + ':' + this.ten(date.getMinutes()) + ':' + this.ten(date.getSeconds())
    },
    ten: (val) => {
      val = Number(val)
      return val < 10 ? '0' + val : val
    },
    dele(type, driver) {
      var _this = this
      var pkDriver = ''
      if (type === 1) {
        pkDriver = [driver]
      } else if (type === 2) {
        if (_this.multipleSelection.length === 0) {
          _this.$message({
            type: 'warning',
            message: '请先勾选需删除的司机!'
          })
          return false
        }
        pkDriver = _this.multipleSelection.map(item => item.pkDriver)
      }
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDriver({
          pkDrivers: pkDriver
        }).then(response => {
          if (response.data.success) {
            _this.$message({
              type: 'success',
              message: response.data.msg
            })
          } else {
            _this.$message({
              type: 'warning',
              message: response.data.msg
            })
          }
          _this.listQuery.pageNum = 1
          _this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
