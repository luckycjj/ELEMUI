<template>
  <div class="driverdialog">
    <el-dialog :visible.sync="visible" title="选择车辆司机" width="70%" @close="close">
      <el-row>
        <el-col :xs="24" :sm="24" :lg="8">
          <p class="car_style">运输总重量：
            <span >{{ changeFixed(weight) }}(t)</span>
          </p>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <p class="car_style">已选车辆：
            <span v-if="templateSelection.car">{{ templateSelection.car.carno }}</span>
            <span v-else-if="templateSelection.carHead&&!templateSelection.carHang">{{ templateSelection.carHead.carno }}</span>
            <span v-else-if="templateSelection.carHang&&!templateSelection.carHead">{{ templateSelection.carHang.carno }}</span>
            <span v-else-if="templateSelection.carHead&&templateSelection.carHang">{{ templateSelection.carHead.carno }} / {{ templateSelection.carHang.carno }}</span>
            <span v-else/>
          </p>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <p class="car_style">已选司机：
            <span v-if="templateSelection.driver">{{ templateSelection.driver.driver_name }}</span>
          </p>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName">
        <el-tab-pane label="车辆" name="first">
          <el-form :model="listQueryCar" :inline="true" >
            <el-row>
              <el-form-item label-width="100px" label="车辆类型：" >
                <el-radio v-model="listQueryCar.car_type" label="整车" @change="carType">整车</el-radio>
                <el-radio v-model="listQueryCar.car_type" label="车头/车挂" @change="carType">车头/车挂</el-radio>
              </el-form-item>
            </el-row>
            <el-row v-if="!flag">
              <el-form-item label-width="100px" label="车牌号：" >
                <el-input v-model="listQueryCar.carno" autocomplete="off"/>
              </el-form-item>
              <el-form-item label-width="100px" label="车型：" >
                <el-select v-model="listQueryCar.car_model" placeholder="请选择车型">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getCarList">{{ $t('table.search') }}</el-button>
              <el-table ref="carTable" :data="carList" border >
                <!-- <el-table-column type="selection" min-width="55"/> -->
                <el-table-column label="选择" width="55" align="center">
                  <template slot-scope="scope">
                    <el-radio :label="scope.row.carno" v-model="selectCarRadio" @change.native="selectCarRow(scope.$index,scope.row)">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column property="carno" label="车牌号" min-width="160"/>
                <el-table-column label="剩余载重量/总载重量" min-width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.free_load }}/{{ scope.row.cost_load }}</span>
                  </template>
                </el-table-column>
                <el-table-column property="car_type" label="车辆类型" min-width="120"/>
                <el-table-column property="car_model" label="车型" min-width="120"/>
                <el-table-column property="car_status" label="状态" min-width="150"/>
              </el-table>
            </el-row>
            <el-row v-if="flag">
              <el-col :xs="8" :sm="8" :lg="8" style="margin-right:10px">
                <el-form-item label-width="80px" label="车牌号：" >
                  <el-input v-model="listQueryHeadCar.carno" autocomplete="off" placeholder="车头" style="max-width:120px"/>
                </el-form-item>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getCarHeadList">{{ $t('table.search') }}</el-button>
                <el-table ref="carHeadTable" :data="carHeadList" border>
                  <el-table-column label="选择" width="55" align="center">
                    <template slot-scope="scope">
                      <el-radio :label="scope.row.carno" v-model="selectCarHeadRadio" @change.native="selectCarHeadRow(scope.$index,scope.row)">&nbsp;</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column property="carno" label="车牌号(车头)" min-width="120"/>
                  <el-table-column property="vbillstatus" label="状态" min-width="100"/>
                </el-table>
              </el-col>
              <el-col :xs="15" :sm="15" :lg="15">
                <el-form-item label-width="80px" label="车牌号：" >
                  <el-input v-model="listQueryHangCar.carno" autocomplete="off" placeholder="车挂" style="max-width:120px"/>
                </el-form-item>
                <el-form-item label-width="60px" label="车型：" >
                  <el-select v-model="listQueryHangCar.carModel" placeholder="请选择车型" style="max-width:140px">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getCarHangList">{{ $t('table.search') }}</el-button>
                <el-table ref="carHangTable" :data="carHangList" border>
                  <el-table-column label="选择" width="55" align="center">
                    <template slot-scope="scope">
                      <el-radio :label="scope.row.carno" v-model="selectCarHangRadio" @change.native="selectCarHangRow(scope.$index,scope.row)">&nbsp;</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column property="carno" label="车牌号(车挂)" min-width="120"/>
                  <el-table-column label="剩余载重量/总载重量" min-width="130">
                    <template slot-scope="scope">
                      <span>{{ scope.row.feeLoad }}/{{ scope.row.costLoad }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="carModel" label="车型" min-width="100"/>
                  <el-table-column property="vbillstatus" label="状态" min-width="100"/>
                </el-table>
              </el-col>
            </el-row>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="司机" name="second">
          <el-form :model="listQueryDriver" :inline="true" >
            <el-form-item label-width="100px" label="司机名称:" >
              <el-input v-model="listQueryDriver.driver_name" autocomplete="off" />
            </el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getDriverList">{{ $t('table.search') }}</el-button>
          </el-form>
          <el-table ref="driverTable" :data="driverList" border >
            <el-table-column label="选择" width="55" align="center">
              <template slot-scope="scope">
                <el-radio :label="scope.row.driver_code" v-model="selectDriverRadio" @change.native="selectDriverRow(scope.$index,scope.row)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column property="driver_name" label="司机名字" min-width="150"/>
            <el-table-column property="driver_mobile" label="司机电话" min-width="150"/>
            <el-table-column property="driver_status" label="司机状态" min-width="150"/>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { carDriverTable, carHeadTable, carHangTable } from '@/api/stow'
import { Debounce } from '@/utils/debounce'
export default {
  name: 'SelectCarrier',
  components: {},
  directives: { waves },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    weight: {
      type: Number,
      default: 0
    },
    onselect: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      visible: this.show,
      templateSelection: {
        car: null,
        carHead: null,
        carHang: null,
        driver: {
          driver_code: '',
          driver_name: '',
          driver_mobile: ''
        }
      },
      options: [{
        value: '',
        label: '全部'
      }, {
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
      }],
      selectCarRadio: '',
      selectCarHeadRadio: '',
      selectCarHangRadio: '',
      selectDriverRadio: '',
      listQueryCar: {
        userCode: '15111111112',
        carno: '',
        car_type: '整车',
        car_model: '',
        weight_count: '',
        driver_name: '',
        type: ''// 车辆查询type传1，司机查询时传2
      },
      listQueryHeadCar: {
        userCode: '15111111112',
        carno: ''
      },
      listQueryHangCar: {
        userCode: '15111111112',
        carno: '',
        carModel: '',
        weight: ''
      },
      listQueryDriver: {
        userCode: '15111111112',
        carno: '',
        car_type: '',
        car_model: '',
        weight_count: '',
        driver_name: '',
        type: ''// 车辆查询type传1，司机查询时传2
      },
      carList: null,
      carHeadList: null,
      carHangList: null,
      driverList: null,
      flag: false,
      activeName: 'first'

    }
  },
  watch: {
    show(val) {
      this.visible = val// 新增result的watch，监听变更并同步到myResult上
    }
  },
  created() {
    this.getCarList()
    this.getDriverList()
  },
  methods: {
    reload() {
      this.listQueryCar.car_type = '整车'
      this.flag = false
      this.isRouterAlive = false
      this.selectCarRadio = null
      this.selectCarHeadRadio = null
      this.selectCarHangRadio = null
      this.templateSelection.car = null
      this.templateSelection.carHead = null
      this.templateSelection.carHang = null
      this.templateSelection.driver = null
      this.selectDriverRadio = null
      this.activeName = 'first'
      this.$refs.driverTable.clearSelection()
      // this.$refs.carTable.clearSelection()
    },
    selectCarRow(index, row) { // 获取选中数据
      this.templateSelection.car = row
    },
    selectCarHeadRow(index, row) {
      this.templateSelection.carHead = row
    },
    selectCarHangRow(index, row) {
      this.templateSelection.carHang = row
    },
    selectDriverRow(index, row) {
      this.templateSelection.driver = row
    },
    getCarList() {
      this.listLoading = true
      this.listQueryCar.type = 1
      this.listQueryCar.weight_count = this.weight
      carDriverTable(this.listQueryCar).then(response => {
        this.carList = response.data.data.car
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    getCarHeadList() {
      carHeadTable(this.listQueryHeadCar).then(response => {
        // console.log(response.data)
        this.carHeadList = response.data.datas
      })
    },
    getCarHangList() {
      this.listQueryHangCar.weight = this.weight
      carHangTable(this.listQueryHangCar).then(response => {
        // console.log(response.data.datas)
        this.carHangList = response.data.datas
      })
    },
    getDriverList() {
      this.listLoading = true
      this.listQueryDriver.type = 2
      this.listQueryDriver.weight_count = this.weight
      carDriverTable(this.listQueryDriver).then(response => {
        this.driverList = response.data.data.driver
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    close() {
      this.reload()
      this.$emit('update:show', false)
    },
    save: Debounce(function() {
      // debugger
      // debugger
      if (!this.templateSelection.car && (!this.templateSelection.carHead || !this.templateSelection.carHang)) {
        this.$message({
          type: 'warning',
          message: '请选择车辆!',
          duration: 5000
        })
        return false
      }
      if (!this.templateSelection.driver.driver_name) {
        this.$message({
          type: 'warning',
          message: '请选择司机!',
          duration: 5000
        })
        return false
      }
      if (this.onselect) {
        this.onselect(this.templateSelection)
      }
      this.$emit('update:show', false)
    }),
    carType(val) {
      // console.log(val)
      if (val === '整车') {
        this.flag = false
        this.templateSelection.carHead = null
        this.templateSelection.carHang = null
        this.selectCarHeadRadio = null
        this.selectCarHangRadio = null
        this.getCarList()
      } else {
        this.flag = true
        this.selectCarRadio = null
        this.templateSelection.car = null
        this.getCarHeadList()
        this.getCarHangList()
      }
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
<style rel="stylesheet/scss" lang="scss">
 .el-dialog__body{
    padding-top: 0px;
  }
  .car_style{
    font-size:16px;
    color:#409EFF;
    font-weight:700
  }
</style>

