<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.corpName" placeholder="公司名称" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.contact" placeholder="联系人名称" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.contactMobile" placeholder="联系人电话" style="width: 200px;" class="filter-item"/>
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
      <el-table-column prop="custCode" label="客户编号" min-width="100">
        <template slot-scope="scope">
          <span style="color:#409EFF" @click="addNew(2,scope.row.pkCustomer)">{{ scope.row.custCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="corpName" label="公司名称" min-width="120"/>
      <el-table-column prop="corpAbbreName" label="公司简称" min-width="120"/>
      <el-table-column prop="corpAddr" label="公司地址" min-width="120"/>
      <el-table-column prop="contact" label="联系人" min-width="150"/>
      <el-table-column prop="contactMobile" label="联系电话" min-width="150"/>
      <el-table-column prop="email" label="公司邮箱" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="createTime" label="创建时间" min-width="80"/>
      <el-table-column prop="createUser" label="创建人" min-width="80"/>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="addNew(1,scope.row.pkCustomer)">编辑</el-button>
          <span style="font-size:16px;">|</span>
          <el-button type="text" @click="dele(1,scope.row.pkCustomer)">删除</el-button>
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
import { custList, deleteCust } from '@/api/setting'
export default {
  name: 'OwnerManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      startendTime: '',
      multipleSelection: [],
      tableKey: 0,
      listQuery: {
        corpName: '', // 公司名称
        contactMobile: '', // 联系人电话
        contact: '', // 联系人名称
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
    getList() {
      this.listLoading = true
      custList(this.listQuery).then(response => {
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
      this.listQuery.corpName = ''
      this.listQuery.contactMobile = ''
      this.listQuery.contact = ''
      this.listQuery.pageNum = 1
      this.getList()
    },
    addNew(type, number) {
      var _this = this
      var data = this.$route.path
      if (type === 0) {
        _this.$router.push({ path: '/lookCustMessage/new', query: { type: type, tpye2: data }})
      } else if (type === 1) {
        _this.$router.push({ path: '/lookCustMessage/' + number, query: { type: type, tpye2: data }})
      } else if (type === 2) {
        _this.$router.push({ path: '/lookCustMessage/' + number, query: { type: type }})
      }
    },
    dele(type, driver) {
      var _this = this
      var pkCustomer = ''
      if (type === 1) {
        pkCustomer = [driver]
      } else if (type === 2) {
        if (_this.multipleSelection.length === 0) {
          _this.$message({
            type: 'warning',
            message: '请先勾选需删除的客户!'
          })
          return false
        }
        pkCustomer = _this.multipleSelection.map(item => item.pkCustomer)
      }
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCust({
          pkCustomers: pkCustomer
        }).then(response => {
          if (response.data.success === true) {
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
