<template>
  <div class="createPost-container">
    <el-form
      ref="carForm"
      :model="carForm"
      :rules="rules"
      label-position="left"
      label-width="120px"
      class="form-container el-form"
    >
      <div class="createPost-main-container">
        <div class="portlet light">
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              车辆信息
            </div>
          </div>
          <!-- BEGIN FORM-->
          <div class="form-body">
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="车辆编号">
                  <el-input v-model="carForm.carCode" disabled/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="车辆类型" prop="carType">
                  <el-select v-model="carForm.carType" clearable class="required" placeholder="车辆类型" >
                    <el-option
                      v-for="item in carTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="车辆来源" prop="carProp">
                  <el-select v-model="carForm.carProp" clearable class="required" placeholder="车辆来源" >
                    <el-option
                      v-for="item in carPropList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="8">
                <el-col :xs="12" :sm="12" :lg="12">
                  <el-form-item label="车牌号">
                    <el-select v-model="carNum" >
                      <el-option
                        v-for="item in license"
                        :key="item.region"
                        :label="item.region"
                        :value="item.add"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="12" >
                  <el-form-item label-width="0" prop="carNum2">
                    <el-input v-model="carNum2" class="required" maxlength="9"/>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="车辆属性" prop="carModel">
                  <el-select v-model="carForm.carModel" clearable class="required" placeholder="车辆类型" >
                    <el-option
                      v-for="item in carModelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="车长(米)" prop="carLength">
                  <el-select v-model="carForm.carLength" clearable placeholder="车长(米)" class="required">
                    <el-option
                      v-for="item in car_lengthOptions"
                      :key="item.key"
                      :label="item.display_name"
                      :value="item.key"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="载重(吨)" prop="loadWeight">
                  <el-input v-model="carForm.loadWeight" type="number" class="required"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="车辆状态">
                  <el-select v-model="carForm.carStatus" :disabled="!isEdit" clearable placeholder="车辆状态">
                    <el-option
                      v-for="item in carStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="审核状态">
                  <el-select v-model="carForm.checkStatus" clearable placeholder="审核状态" disabled>
                    <el-option
                      v-for="item in checkStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="16">
                <el-form-item label="备注">
                  <el-input v-model="carForm.memo" placeholder="请输入车辆的特殊信息" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="是否失效">
                  <el-switch
                    v-model="carForm.lockedFlag"
                    active-value="Y"
                    inactive-value="N"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="行驶证">
                  <el-upload
                    ref="upload"
                    :before-upload="beforeUpload"
                    :on-success="successUpload"
                    :on-remove="handleRemove"
                    :limit="1"
                    :file-list="fileList"
                    :accept="'image/jpeg,image/jpg,image/png'"
                    :action="address"
                    :headers="myHeaders"
                    list-type="picture"
                    class="required">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="创建人">
                  <el-input v-model="carForm.createUser" disabled/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="创建时间">
                  <el-input v-model="carForm.createTime" disabled/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="page-operation-bottons">
          <el-button
            style="margin: 10px 20px;float:right"
            type="primary"
            icon="el-icon-check"
            @click="submitForm"
          >保存</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import EnumType from '@/constants/enumType'
import { addOrUpdateCar } from '@/api/setting'
import { getToken, getSysCode, getUserCode } from '@/utils/auth'
import { shujvyuan } from '@/utils/shujv'
import { Debounce } from '@/utils/debounce'
import { closeSelectedTag } from '@/utils/closedPath'
export default {
  // name: 'AddOrder',
  components: { },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
      ],
      carForm: {
        pkCar: '',
        carCode: '',
        carType: '',
        carProp: '', // 传数字
        carno: '',
        carModel: '',
        carLength: '',
        loadWeight: '',
        carStatus: 0, // 传数字
        driverLicence: '',
        memo: '',
        checkStatus: '2', // 传数字
        createUser: '',
        createTime: '',
        lockedFlag: 'N'
      },
      address: process.env.BASE_API + '/file/upload.do',
      ftpurl: 'http://39.98.34.129/images',
      imgList: [],
      fileList: [],
      rules: {
        carType: [{ required: true, message: '请选择车辆类型', trigger: 'change' }],
        carProp: [{ required: true, message: '请选择车辆来源', trigger: 'change' }],
        // carNum2: [{ required: true, message: '请填写车牌', trigger: 'blur' }],
        carModel: [{ required: true, message: '请选择车辆属性', trigger: 'change' }],
        carLength: [{ required: true, message: '请选择车长', trigger: 'change' }],
        loadWeight: [{ required: true, message: '请填写载重', trigger: 'blur' }]
      },
      license: [],
      carNum: '沪',
      carNum2: ''
    }
  },
  computed: {
    myHeaders() {
      return {
        'token': getToken(),
        'userCode': getUserCode(),
        'sysId': getSysCode()
      }
    }
  },
  watch: {

  },
  created() {
    this.license = shujvyuan.first()
    // console.log(this.license)
    if (this.isEdit) {
      this.imgList = []
      this.fileList = []
      //   console.log(this.$route.params.carInfo)
      this.carForm = Object.assign({}, this.$route.params.carInfo)
      if (this.carForm.carProp === '自有') {
        this.carForm.carProp = 1
      } else if (this.carForm.carProp === '外协') {
        this.carForm.carProp = 2
      } else if (this.carForm.carProp === '挂靠') {
        this.carForm.carProp = 3
      } else if (this.carForm.carProp === '设备') {
        this.carForm.carProp = 4
      }
      if (this.carForm.carStatus === '空闲') {
        this.carForm.carStatus = 0
      } else if (this.carForm.carStatus === '使用中') {
        this.carForm.carStatus = 1
      } else if (this.carForm.carStatus === '在途') {
        this.carForm.carStatus = 2
      } else if (this.carForm.carStatus === '维修') {
        this.carForm.carStatus = 3
      } else if (this.carForm.carStatus === '保养') {
        this.carForm.carStatus = 4
      }
      if (this.carForm.checkStatus === '待审核') {
        this.carForm.checkStatus = '1'
      } else if (this.carForm.checkStatus === '已审核') {
        this.carForm.checkStatus = '2'
      } else if (this.carForm.checkStatus === '已驳回') {
        this.carForm.checkStatus = '3'
      }
      if (this.carForm.driverLicence) {
        this.fileList.push({ name: this.carForm.driverLicence, url: this.ftpurl + this.carForm.driverLicence })
      }
      this.carNum = this.carForm.carno.substr(0, 1)
      this.carNum2 = this.carForm.carno.substr(1)
    //   console.log(this.carForm)
    } else {
    //   console.log(2)
      // this.carForm.createUser = getUserCode()
      // this.carForm.createTime = this.time()
      this.carForm.createUser = ''
      this.carForm.createTime = ''
      this.carNum = '沪'
      this.carNum2 = ''
    }
  },
  mounted() {

  },
  methods: {
    time() {
      var date = new Date()
      return date.getFullYear() + '-' + this.ten(date.getMonth() + 1) + '-' + this.ten(date.getDate()) + ' ' + this.ten(date.getHours()) + ':' + this.ten(date.getMinutes()) + ':' + this.ten(date.getSeconds())
    },
    ten: (val) => {
      val = Number(val)
      return val < 10 ? '0' + val : val
    },
    handleRemove(file, fileList) {
      this.imgList = fileList
      this.carForm.driverLicence = ''
      // console.log(file, fileList)
    },
    successUpload(response, file, fileList) {
      // console.log(response, file, fileList)
      this.imgList = fileList
      this.carForm.driverLicence = response.data.fileUrl
      // console.log(this.carForm.driverLicence)
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!this.fileType(file.name)) {
        this.$message.warning('只能上传jpg/png文件')
        return false
      }
      if (!isLt2M) {
        this.$message.warning('上传头像图片大小不能超过 5MB!')
        return false
      }
    },
    fileType(data) {
      return /\.(jpg|png|jpeg)$/.test(data)
    },
    submitForm: Debounce(function() {
      if (this.carForm.carType === '') {
        this.$message({
          type: 'warning',
          message: '请选择车辆类型'
        })
        return false
      }
      if (this.carForm.carProp === '') {
        this.$message({
          type: 'warning',
          message: '请选择车辆来源'
        })
        return false
      }
      if (this.carNum2 === '') {
        this.$message({
          type: 'warning',
          message: '请填写车牌'
        })
        return false
      }
      this.carForm.carno = this.carNum + this.carNum2
      if (this.carForm.carno) {
        var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
        const result = express.test(this.carForm.carno)
        console.log(result)
        if (!result) {
          this.$message({
            type: 'warning',
            message: '请输入正确的车牌号'
          })
          return false
        }
      }
      if (this.carForm.carModel === '') {
        this.$message({
          type: 'warning',
          message: '请选择车辆属性'
        })
        return false
      }
      if (this.carForm.carLength === '') {
        this.$message({
          type: 'warning',
          message: '请选择车长'
        })
        return false
      }
      if (this.carForm.loadWeight === '') {
        this.$message({
          type: 'warning',
          message: '请输入正确的载重'
        })
        return false
      }
      if (!this.carForm.driverLicence) {
        this.$message({
          type: 'warning',
          message: '请上传行驶证'
        })
        return false
      }
      var _this = this
      this.$refs.carForm.validate((valid) => {
        if (valid) {
          // console.log(this.carForm)
          addOrUpdateCar(this.carForm).then(response => {
            // console.log(response)
            if (response.data.success) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              if (!this.isEdit) {
                this.fileList = []
                this.carNum = '沪'
                this.carNum2 = ''
                this.carForm.memo = ''
                this.carForm.lockedFlag = 'N'
                this.$refs.carForm.resetFields()
                this.$refs.upload.clearFiles()
                closeSelectedTag.closedPath(_this, 'add-carinfo', '/basicDataCarrier')
              } else {
                closeSelectedTag.closedPath(_this, 'edit-carinfo', '/basicDataCarrier')
              }
            } else {
              this.$message({
                type: 'warning',
                message: response.data.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  background: #eff3f8;
  .createPost-main-container {
    padding: 20px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }

  }

}
</style>
<style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
