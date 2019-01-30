<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <el-form ref="carForm" :model="carForm" label-width="80px">
        <div class="portlet light">
          <div class="note note-info">
            <span>车辆详情</span>
            <span style="float:right" class="link-type" @click="editCar">编辑</span>
          </div>
          <div class="portlet-body form">
            <!-- BEGIN FORM-->
            <div class="form-body">
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">车辆编号：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.carCode }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">车辆类型：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.carType }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="6" :sm="6" :lg="7" class="control-label">车辆来源：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.carProp }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">车牌号：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.carno }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">车辆属性：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.carModel }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="6" :sm="6" :lg="7" class="control-label">车长(米)：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.carLength }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">载重(吨)：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.loadWeight }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">车辆状态：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.carStatus }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="6" :sm="6" :lg="7" class="control-label">审核状态：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.checkStatus }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">备注：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.memo }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">是否失效：</el-col>
                    <el-switch
                      v-model="carForm.lockedFlag"
                      active-value="Y"
                      inactive-value="N"
                      disabled/>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">行驶证：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">
                      <el-popover
                        placement="bottom"
                        title=""
                        trigger="hover">
                        <img :src="ftpurl+carForm.driverLicence" style="max-width:600px;max-height:400px">
                        <img slot="reference" :src="ftpurl+carForm.driverLicence" :alt="carForm.driverLicence" class="imgSize" style="margin-right:5px">
                      </el-popover>
                    </el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">创建人：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.createUser }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="6" :sm="6" :lg="7" class="control-label">创建时间：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ carForm.createTime }}</el-col>
                  </el-col>
                </div>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>

import { parseTime } from '@/utils'
import { detailCar } from '@/api/setting'
export default {
  name: 'CarInfoDetails',
  components: { parseTime },
  props: {

  },
  data() {
    return {
      pkCar: '',
      carForm: {
        carCode: '',
        carType: '',
        carProp: '', // 传数字
        carno: '',
        carModel: '',
        carLength: '',
        loadWeight: '',
        carStatus: '', // 传数字
        driverLicence: '',
        memo: '',
        checkStatus: '', // 传数字
        createUser: '',
        createTime: '',
        lockedFlag: ''
      },
      ftpurl: 'http://39.98.34.129/images'
    }
  },
  computed: {},
  created() {
    // console.log(this.$route.params.carCode)
    this.pkCar = this.$route.params.carCode
    this.$nextTick(() => {
      this.getCarInfo()
    })
  },
  methods: {
    getCarInfo() {
      const data = {
        pkCar: this.pkCar
      }
      detailCar(data).then(response => {
        // console.log(response)
        if (response.data.success) {
          this.carForm = Object.assign({}, response.data.data)
          if (this.carForm.carProp === '1') {
            this.carForm.carProp = '自有'
          } else if (this.carForm.carProp === '2') {
            this.carForm.carProp = '外协'
          } else if (this.carForm.carProp === '3') {
            this.carForm.carProp = '挂靠'
          } else if (this.carForm.carProp === '4') {
            this.carForm.carProp = '设备'
          }
          if (this.carForm.carStatus === '0') {
            this.carForm.carStatus = '空闲'
          } else if (this.carForm.carStatus === '1') {
            this.carForm.carStatus = '使用中'
          } else if (this.carForm.carStatus === '2') {
            this.carForm.carStatus = '在途'
          } else if (this.carForm.carStatus === '3') {
            this.carForm.carStatus = '维修'
          } else if (this.carForm.carStatus === '4') {
            this.carForm.carStatus = '保养'
          }
          if (this.carForm.checkStatus === '1') {
            this.carForm.checkStatus = '待审核'
          } else if (this.carForm.checkStatus === '2') {
            this.carForm.checkStatus = '已审核'
          } else if (this.carForm.checkStatus === '3') {
            this.carForm.checkStatus = '已驳回'
          }
        }
      })
    },
    editCar() {
      console.log(this.carForm)
      this.$router.push({ name: 'EditCarinfo', params: { 'carInfo': this.carForm }})
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
    .imgSize{
  height: 40px;
  max-width: 80px;
}
  }
}
</style>
