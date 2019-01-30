<template>
  <div>
    <div class="filter-container">
      <el-input v-model.trim="listQuery.carType" placeholder="车牌号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.carType" clearable class="filter-item" placeholder="车辆类型" style="width: 200px;">
        <el-option
          v-for="item in carTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.carStatus" clearable class="filter-item" placeholder="车辆状态" style="width: 200px;">
        <el-option
          v-for="item in carStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.carProp" clearable class="filter-item" placeholder="车辆来源" style="width: 200px;">
        <el-option
          v-for="item in carPropList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetForm">重置</el-button>
    </div>
    <div style="width: 100%;">
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
        <!-- <el-table-column prop="carCode" label="编号" min-width="100"/> -->
        <el-table-column prop="carCode" label="编号" min-width="120">
          <template slot-scope="scope">
            <router-link :to="'/settingBox/carinfo-details/'+scope.row.pkCar" class="link-type">
              <span>{{ scope.row.carCode }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="checkStatus" label="审核状态" min-width="120"/>
        <el-table-column prop="carno" label="车牌号" min-width="120"/>
        <el-table-column prop="carStatus" label="车辆状态" min-width="150"/>
        <el-table-column prop="carType" label="车辆类型" min-width="150"/>
        <el-table-column prop="carProp" label="车辆来源" min-width="150" />
        <el-table-column prop="carModel" label="车辆属性" min-width="120"/>
        <el-table-column prop="carLength" label="车长(米)" min-width="120"/>
        <el-table-column prop="loadWeight" label="载重(吨)" min-width="120"/>
        <el-table-column prop="memo" label="备注" min-width="100"/>
        <el-table-column prop="lockedFlag" label="是否失效" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.lockedFlag"
              active-value="Y"
              inactive-value="N"
              @change="locked(scope.row.pkCar,scope.row.lockedFlag)"/>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="录入人" min-width="120"/>
        <el-table-column prop="createTime" label="录入时间" min-width="160"/>

        <el-table-column fixed="right" label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="editCar(scope.row)">编辑</el-button>
            <span style="font-size:16px;">|</span>
            <el-button type="text" @click="deleteCar(scope.row.pkCar)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-operation-bottons">
      <el-row>
        <el-button class="change-btn" icon="el-icon-plus" @click="addDialog">新增</el-button>
        <el-button class="cancel-btn" icon="el-icon-delete" @click="deleteCars">删除</el-button>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" class="page-style" @pagination="getList" />
      </el-row>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import EnumType from '@/constants/enumType'
import { carList, deleteCar, updateCar } from '@/api/setting'
import waves from '@/directive/waves' // Waves directive
export default {
  name: 'CarManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      dialogVisible: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        carno: '', // 车牌号
        carType: '', // 车辆类型
        carStatus: '', // 车辆状态
        carProp: '' // 车辆来源
      },
      multipleSelection: [],
      car_lengthOptions: EnumType.carLengthStates,
      carTypeList: [
        {
          value: '整车',
          label: '整车'
        }, {
          value: '车头',
          label: '车头'
        }, {
          value: '车挂',
          label: '车挂'
        }
      ],
      carStatusList: [
        {
          value: 0,
          label: '空闲'
        }, {
          value: 1,
          label: '使用中'
        }, {
          value: 3,
          label: '维修'
        }, {
          value: 4,
          label: '保养'
        }
      ],
      carPropList: [
        {
          value: 1,
          label: '自有'
        }, {
          value: 2,
          label: '外协'
        }, {
          value: 3,
          label: '挂靠'
        }
      ],
      carModelList: [
        {
          value: '平板车',
          label: '平板车'
        }, {
          value: '栏车',
          label: '栏车'
        }, {
          value: '厢式车',
          label: '厢式车'
        }, {
          value: '冷藏车',
          label: '冷藏车'
        }, {
          value: '特种车',
          label: '特种车'
        }
      ],
      checkStatusList: [
        {
          value: '1',
          label: '待审核'
        }, {
          value: '2',
          label: '已审核'
        }, {
          value: '3',
          label: '已驳回'
        }
      ]

    }
  },
  computed: {
    tableHeight() {
      return innerHeight - 430
    }
    // carno: {
    //   get: function() {
    //     return this.listQuery.carno
    //   },
    //   set: function(value) {
    //     this.listQuery.carno = this.changeStr(value)
    //   }
    // }
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
  methods: {
    changeStr(item) {
      return item.replace(/(^\s+)|(\s+$)/g, '')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.listLoading = true
      this.list = []
      carList(this.listQuery).then(response => {
        this.list = response.data.records

        this.total = response.data.totalRecords || 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetForm() {
      this.listQuery.carno = ''
      this.listQuery.carType = ''
      this.listQuery.carStatus = ''
      this.listQuery.carProp = ''
      this.getList()
    },
    editCar(row) {
      this.$router.push({ name: 'EditCarinfo', params: { 'carInfo': row }})
    },
    deleteCar(row) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // debugger
        const data = {
          pkCars: row.split()
        }

        deleteCar(data).then(response => {
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
    deleteCars() {
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
          selectRowNos.push(item.pkCar)
        })
        const data = {
          pkCars: selectRowNos
        }
        deleteCar(data).then(response => {
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
      // this.dialogVisible = true
      this.$router.push({ name: 'CreateCarinfo' })
    },
    locked(item, item2) {
      const data = {
        pkCar: item,
        lockedFlag: item2
      }
      updateCar(data).then(response => {
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

