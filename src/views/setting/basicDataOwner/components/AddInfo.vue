<template>
  <div class="createPost-container">
    <el-form
      ref="addForm"
      :model="addForm"
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
              地址信息
            </div>
          </div>
          <!-- BEGIN FORM-->
          <div class="form-body">
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="地址编号">
                  <el-input v-model="addForm.addr_code" disabled/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="省份" prop="pk_province">
                  <!-- <el-input v-model="addForm.pk_province" class="required"/> -->
                  <el-select v-model="addForm.pk_province" placeholder="请选择省" class="required" @change="selectPro">
                    <el-option
                      v-for="item in provinceList"
                      :key="item.region"
                      :label="item.region"
                      :value="item.region"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="市" prop="pk_city">
                  <!-- <el-input v-model="addForm.pk_city" class="required"/> -->
                  <el-select v-model="addForm.pk_city" placeholder="请选择市" class="required" @change="selectCity">
                    <el-option
                      v-for="item in cityList"
                      :key="item.region"
                      :label="item.region"
                      :value="item.region"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="区" prop="pk_area">
                  <!-- <el-input v-model="addForm.pk_area" class="required"/> -->
                  <el-select v-model="addForm.pk_area" placeholder="请选择区" class="required">
                    <el-option
                      v-for="item in areaList"
                      :key="item.region"
                      :label="item.region"
                      :value="item.region"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="详细地址" prop="detail_addr">
                  <el-input v-model="addForm.detail_addr" class="required" maxlength="50"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="地址名称" prop="addr_name">
                  <el-input v-model="addForm.addr_name" class="required" maxlength="20"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="联系人" prop="contact">
                  <el-input v-model="addForm.contact" maxlength="10"/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="联系手机">
                  <el-input v-model="addForm.mobile" maxlength="11" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="是否失效">
                  <el-switch
                    v-model="addForm.locked_flag"
                    active-value="Y"
                    inactive-value="N"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="录入人">
                  <el-input v-model="addForm.create_user" disabled/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="8">
                <el-form-item label="录入时间">
                  <el-input v-model="addForm.create_time" disabled/>
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
// import EnumType from '@/constants/enumType'
import { saveOrUpdateAddr } from '@/api/setting'
import { provinceCityArea } from '@/utils/provinceCityArea'
import { Debounce } from '@/utils/debounce'
import { both } from '@/utils/dateJS'
import { sortList } from '@/utils/sort'
import { closeSelectedTag } from '@/utils/closedPath'
// import { getUserCode } from '@/utils/auth'
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
      addForm: {
        addr_code: '',
        pk_province: '',
        pk_city: '',
        pk_area: '',
        detail_addr: '',
        addr_name: '',
        contact: '',
        mobile: '',
        locked_flag: 'N',
        create_user: '',
        create_time: ''
      },
      rules: {
        pk_province: [{ required: true, message: '请填写省份', trigger: 'change' }],
        pk_city: [{ required: true, message: '请填写市', trigger: 'change' }],
        pk_area: [{ required: true, message: '请填写区', trigger: 'change' }],
        detail_addr: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
        addr_name: [{ required: true, message: '请填写公司名称', trigger: 'blur' }]
      },
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.provinceList = provinceCityArea
    // console.log(this.provinceList)
    for (var i = 0; i < this.provinceList.length; i++) {
      this.provinceList[i].region = this.provinceList[i].region === null ? '' : this.provinceList[i].region
    }
    sortList.pingyin(this.provinceList, ['pingyin'], 'region')
    if (this.isEdit) {
      this.addForm = Object.assign({}, this.$route.params.addInfo)
    } else {
      // console.log(2)
      // this.addForm.create_user = getUserCode()
      // this.addForm.create_time = this.time()
      this.addForm.create_user = ''
      this.addForm.create_time = ''
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
    selectPro(item) {
      var _this = this
      _this.cityList = []
      _this.areaList = []
      _this.addForm.pk_city = ''
      _this.addForm.pk_area = ''
      for (var i = 0; i < _this.provinceList.length; i++) {
        if (item === _this.provinceList[i].region) {
          _this.cityList = _this.provinceList[i].child
          for (var j = 0; j < _this.cityList.length; j++) {
            _this.cityList[j].region = _this.cityList[j].region === null ? '' : _this.cityList[j].region
          }
          sortList.pingyin(_this.cityList, ['pingyin'], 'region')
          break
        }
      }
    },
    selectCity(item) {
      var _this = this
      _this.areaList = []
      _this.addForm.pk_area = ''
      for (var i = 0; i < _this.cityList.length; i++) {
        if (item === _this.cityList[i].region) {
          _this.areaList = _this.cityList[i].child
          for (var j = 0; j < _this.areaList.length; j++) {
            _this.areaList[j].region = _this.areaList[j].region === null ? '' : _this.areaList[j].region
          }
          sortList.pingyin(_this.areaList, ['pingyin'], 'region')
          break
        }
      }
    },
    submitForm: Debounce(function() {
      if (this.addForm.pk_province === '') {
        this.$message({
          type: 'warning',
          message: '请选择省份'
        })
        return false
      }
      if (this.addForm.pk_city === '') {
        this.$message({
          type: 'warning',
          message: '请选择市'
        })
        return false
      }
      if (this.addForm.pk_area === '') {
        this.$message({
          type: 'warning',
          message: '请选择区'
        })
        return false
      }
      if (this.addForm.detail_addr === '') {
        this.$message({
          type: 'warning',
          message: '请填写详细地址'
        })
        return false
      }
      if (this.addForm.addr_name === '') {
        this.$message({
          type: 'warning',
          message: '请填写公司名称'
        })
        return false
      }
      if (this.addForm.mobile) {
        if (!both.telCheck(this.addForm.mobile)) {
          this.$message({
            type: 'warning',
            message: '请填写正确的手机号码'
          })
          return false
        }
      }
      var _this = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const data = {
            pk_address: this.addForm.pk_address,
            addr_code: this.addForm.addr_code,
            pk_province: this.addForm.pk_province,
            pk_city: this.addForm.pk_city,
            pk_area: this.addForm.pk_area,
            detail_addr: this.addForm.detail_addr,
            addr_name: this.addForm.addr_name,
            contact: this.addForm.contact,
            mobile: this.addForm.mobile,
            locked_flag: this.addForm.locked_flag
          }
          saveOrUpdateAddr(data).then(response => {
            // console.log(response)
            if (response.data.success) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              if (!this.isEdit) {
                this.addForm.locked_flag = 'N'
                this.addForm.contact = ''
                this.addForm.mobile = ''
                this.$refs.addForm.resetFields()
                console.log(_this.$route.path)
                closeSelectedTag.closedPath(_this, 'add-addinfo', this.$route.params.addRoute)
              } else {
                console.log(_this.$route)
                // closeSelectedTag.closedPath(_this, 'edit-addinfo', '/basicDataOwner')
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
