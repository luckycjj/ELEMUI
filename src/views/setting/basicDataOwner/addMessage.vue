<template>
  <div>
    <div class="filter-container">
      <el-input v-model.trim="listQuery.companyName" placeholder="公司名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model.trim="listQuery.contact" placeholder="联系人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model.trim="listQuery.mobile" placeholder="联系电话" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="addr_code" label="编号" min-width="120">
        <template slot-scope="scope">
          <router-link :to="'/settingBox/add-details/'+scope.row.pk_address" class="link-type">
            <span>{{ scope.row.addr_code }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="addr_name" label="地址名称" min-width="120"/>
      <el-table-column prop="pk_province" label="省份" min-width="120"/>
      <el-table-column prop="pk_city" label="市" min-width="150"/>
      <el-table-column prop="pk_area" label="区" min-width="150"/>
      <el-table-column prop="detail_addr" label="详细地址" min-width="150" />
      <el-table-column prop="contact" label="联系人" min-width="120"/>
      <el-table-column prop="mobile" label="联系电话" min-width="120"/>
      <el-table-column prop="locked_flag" label="是否失效" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.locked_flag"
            active-value="Y"
            inactive-value="N"
            @change="locked(scope.row.pk_address,scope.row.locked_flag)"/>
        </template>
      </el-table-column>
      <el-table-column prop="create_user" label="录入人" min-width="120"/>
      <el-table-column prop="create_time" label="录入时间" min-width="160"/>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editAdd(scope.row)">编辑</el-button>
          <span style="font-size:16px;">|</span>
          <el-button type="text" @click="deleteAdd(scope.row.pk_address)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-operation-bottons">
      <el-row>
        <el-button class="change-btn" icon="el-icon-plus" @click="addDialog">新增</el-button>
        <el-button class="cancel-btn" icon="el-icon-delete" @click="deleteAdds">删除</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" class="page-style" @pagination="getList" />
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

// import EnumType from '@/constants/enumType'
import { addrList, removeAddr, editAddrStatus } from '@/api/setting'
import waves from '@/directive/waves' // Waves directive
export default {
  name: 'AddMessage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        companyName: '',
        contact: '',
        mobile: ''
      },
      multipleSelection: []

    }
  },
  computed: {
    tableHeight() {
      return innerHeight - 430
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
    console.log(this.$route.path)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.listLoading = true
      this.list = []
      addrList(this.listQuery).then(response => {
        this.list = response.data.records

        this.total = response.data.totalRecords || 0
        this.listLoading = false
      })
    },
    handleFilter() {
      // this.listQuery.pageNum = 1
      this.getList()
    },
    resetForm() {
      this.listQuery.companyName = ''
      this.listQuery.contact = ''
      this.listQuery.mobile = ''
      this.getList()
    },
    editAdd(row) {
      this.$router.push({ name: 'EditAddinfo', params: { 'addInfo': row }})
    },
    deleteAdd(row) {
      // console.log(row)
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // debugger
        const data = {
          pk_address: row
        }

        removeAddr(data).then(response => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败!'
            })
          }
        })
      })
    },
    deleteAdds() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请勾选需删除的条目!'
        })
        return false
      }
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selectRowNos = []
        this.multipleSelection.forEach((item, index, arr) => {
          selectRowNos.push(item.pk_address)
        })
        const data = {
          pk_address: selectRowNos.join()
        }
        removeAddr(data).then(response => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败!'
            })
          }
        })
      })
    },
    addDialog() {
      var data = this.$route.path
      this.$router.push({ name: 'CreateAddinfo', params: { 'addRoute': data }})
    },
    locked(item, item2) {
      // var flag = null
      // if (item2 === 'Y') {
      //   flag = 'N'
      // } else {
      //   flag = 'Y'
      // }

      const data = {
        pk_address: item,
        locked_flag: item2
      }
      editAddrStatus(data).then(response => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'warning',
            message: '操作失败!'
          })
        }
      })
    }
  }
}

</script>

