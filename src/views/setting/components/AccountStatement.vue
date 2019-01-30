<template>
  <div style="width:96%;margin: 30px auto">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      label-position="left"
      label-width="90px"
      class="form-container el-form"
    >
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="司机编号">
            <el-input v-model="postForm.driverCode" :maxlength="100" :disabled="true" placeholder="司机编号"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="司机名称">
            <el-input v-if="source == 0 || source == 1" :maxlength="100" v-model="postForm.driverName" class="required" placeholder="司机名称"/>
            <el-input v-if="source == 2" v-model="postForm.driverName" :disabled="true" placeholder="司机名称"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="手机号">
            <el-input v-if="source === 0 || source === 1" :maxlength="11" v-model="postForm.mobile" class="required" placeholder="手机号" />
            <el-input v-else v-model="postForm.mobile" :disabled="true" placeholder="手机号"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="司机类型">
            <el-select v-if="source === 0 || source === 1" v-model="postForm.driverType" clearable class="filter-item required" placeholder="选择司机类型">
              <el-option
                v-for="item in driver_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
            <el-input v-else v-model="driverTypeGo" :disabled="true" placeholder="司机类型"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="司机状态">
            <el-input v-model="driverStatusGo" :disabled="true" placeholder="司机状态"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="审核状态">
            <el-input v-model="checkStatusGo" :disabled="true" placeholder="审核状态"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="头像">
            <el-upload
              :action="address"
              :accept="'image/jpeg,image/jpg,image/png'"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-success="imgSuccess"
              :file-list="driverPicture"
              :limit = "1"
              :headers="myHeaders"
              class="upload-demo"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5000kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="身份证正面">
            <el-upload
              :accept="'image/jpeg,image/jpg,image/png'"
              :before-upload="beforeUpload"
              :on-remove="handleRemove1"
              :on-success="imgSuccess1"
              :file-list="idCardPos"
              :limit = "1"
              :action="address"
              :headers="myHeaders"
              class="upload-demo"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5000kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="身份证反面">
            <el-upload
              :action="address"
              :accept="'image/jpeg,image/jpg,image/png'"
              :before-upload="beforeUpload"
              :on-remove="handleRemove2"
              :on-success="imgSuccess2"
              :file-list="idCardNeg"
              :limit = "1"
              :headers="myHeaders"
              class="upload-demo"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5000kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="驾驶证">
            <el-upload
              :action="address"
              :accept="'image/jpeg,image/jpg,image/png'"
              :before-upload="beforeUpload"
              :on-remove="handleRemove3"
              :on-success="imgSuccess3"
              :file-list="driverLic"
              :limit = "1"
              :headers="myHeaders"
              class="upload-demo"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5000kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="身份证号码">
            <el-input v-if="source === 0 || source === 1" :maxlength="18" v-model="postForm.id" class="required" placeholder="身份证号码"/>
            <el-input v-else v-model="postForm.id" :disabled="true" placeholder="身份证号码"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="10">
          <el-form-item label="身份证有效日期">
            <el-date-picker
              v-if="source === 0 || source === 1"
              v-model="startendTime"
              type="datetimerange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              class="filter-item required timeReat"
              range-separator="-"
              start-placeholder="起始日期"
              end-placeholder="到期日期"/>
            <el-input v-else v-model="idValidDateGo" :disabled="true" placeholder="身份证有效日期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="驾驶证编号">
            <el-input v-if="source === 0 || source === 1" :maxlength="100" v-model="postForm.licCode" class="required" placeholder="驾驶证编号"/>
            <el-input v-else v-model="postForm.licCode" :disabled="true" placeholder="驾驶证编号"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="初次领证日期">
            <el-date-picker
              v-if="source === 0 || source === 1"
              v-model="postForm.licTime"
              :picker-options="pickerOptions0"
              type="date"
              class="required"
              placeholder="初次领证日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
            <el-input v-else v-model="postForm.licTime" :disabled="true" placeholder="初次领证日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="准驾车型">
            <el-select v-if="source === 0 || source === 1" v-model="postForm.licType" clearable class="filter-item" placeholder="准驾车型">
              <el-option
                v-for="item in driverlic_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
            <el-input v-else v-model="postForm.licType" :disabled="true" placeholder="准驾车型"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="有效期限(年)">
            <el-input v-if="source === 0 || source === 1" v-model="postForm.licYears" class="required" placeholder="有效期限" @change="numberChange"/>
            <el-input v-else v-model="postForm.licYears" :disabled="true" placeholder="有效期限"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col v-if="source === 1 || source === 2" :xs="24" :sm="24" :lg="6">
          <el-form-item label="创建人">
            <el-input v-model="createUser" :disabled="true" placeholder="创建人"/>
          </el-form-item>
        </el-col>
        <el-col v-if="source === 1 || source === 2" :xs="24" :sm="24" :lg="6">
          <el-form-item label="创建时间">
            <el-input v-model="createTime" :disabled="true" placeholder="创建时间"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="是否失效">
            <el-switch
              v-if="source === 1 || source === 0"
              v-model="postForm.lockedFlag"
              active-value="Y"
              inactive-value="N"
            />
            <el-switch
              v-if="source === 2"
              v-model="postForm.lockedFlag"
              active-value="Y"
              inactive-value="N"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-body"/>
    </el-form>
    <div v-if="source === 0 || source === 1" slot="footer" class="dialog-footer">
      <el-button type="primary" style="float: right" @click="save">保 存</el-button>
    </div>
  </div>
</template>
<script>
import { addOrUpdateDriver, detailDriver } from '@/api/setting'
import { both } from '../../../utils/dateJS'
import { cookie } from '../../../utils/cookie'
import { getToken, getSysCode, getUserCode } from '@/utils/auth'
import { Debounce } from '@/utils/debounce'
import { closeSelectedTag } from '../../../utils/closedPath'
export default {
  name: 'AccountStatement',
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
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
      driverlic_type: [{
        value: 'M',
        label: 'M'
      }, {
        value: 'A1',
        label: 'A1'
      }, {
        value: 'A2',
        label: 'A2'
      }, {
        value: 'A3',
        label: 'A3'
      }, {
        value: 'B1',
        label: 'B1'
      }, {
        value: 'B2',
        label: 'B2'
      }, {
        value: 'C1',
        label: 'C1'
      }, {
        value: 'C2',
        label: 'C2'
      }, {
        value: 'C3',
        label: 'C3'
      }],
      startendTime: '',
      createUser: '',
      createTime: '',
      postForm: {
        pkDriver: '',
        driverCode: '', // 司机编号
        driverName: '', // 司机名称
        mobile: '', // 手机号码
        driverType: '', // 司机类型
        driverStatus: '0', // 司机状态
        checkStatus: '2', // 审核状态
        driverPicture: '',
        idCardPos: '',
        idCardNeg: '',
        id: '', // 身份证号
        idValidDate: '', // 身份证有效日期
        driverLic: '',
        licCode: '', // 驾驶证编号
        licTime: '', // 初次领证日期
        licType: '', // 准驾车型
        licYears: '', // 有效日期
        lockedFlag: 'N'// 是否失效
      },
      driverPicture: [],
      idCardPos: [],
      idCardNeg: [],
      driverLic: [],
      type: 0,
      dialogFormVisible: false,
      address: process.env.BASE_API + '/file/upload.do',
      ftpurl: 'http://39.98.34.129/images',
      rules: {},
      source: 0
    }
  },
  computed: {
    myHeaders() {
      return {
        'token': getToken(),
        'userCode': getUserCode(),
        'sysId': getSysCode()
      }
    },
    driverStatusGo() {
      var _this = this
      return _this.postForm.driverStatus === '0' ? '空闲' : _this.postForm.driverStatus === '1' ? '出车中' : _this.postForm.driverStatus === '2' ? '请假' : ''
    },
    driverTypeGo() {
      var _this = this
      return _this.postForm.driverType === '1' ? '自有司机' : _this.postForm.driverType === '2' ? '社会司机' : ''
    },
    checkStatusGo() {
      var _this = this
      return _this.postForm.checkStatus === '0' ? '未提交资料' : _this.postForm.checkStatus === '1' ? '未审核' : _this.postForm.checkStatus === '2' ? '已审核' : _this.postForm.checkStatus === '3' ? '已驳回' : ''
    },
    lockedFlagGo() {
      var _this = this
      return _this.postForm.lockedFlag === 'Y'
    },
    idValidDateGo() {
      var _this = this
      return _this.postForm.idValidDate === '' || _this.postForm.idValidDate === undefined ? '' : _this.postForm.idValidDate.replace(/&/g, ' - ')
    }
  },
  created() {
    var _this = this
    var fullPath = _this.$route.fullPath
    var list = fullPath.split('/')
    var number = list[list.length - 1].split('?')[0]
    _this.source = _this.$route.query.type * 1
    console.log(_this.source)
    if (number.indexOf('new') === -1) {
      detailDriver({
        pkDriver: number
      }).then(response => {
        if (response.data.success === true) {
          _this.postForm = {
            pkDriver: response.data.data.pkDriver,
            driverCode: response.data.data.driverCode, // 司机编号
            driverName: response.data.data.driverName, // 司机名称
            mobile: response.data.data.mobile, // 手机号码
            driverType: response.data.data.driverType, // 司机类型
            driverStatus: response.data.data.driverStatus, // 司机状态
            checkStatus: response.data.data.checkStatus, // 审核状态
            driverPicture: response.data.data.driverPicture === undefined || response.data.data.driverPicture === '' ? '' : response.data.data.driverPicture,
            idCardPos: response.data.data.idCardPos === undefined || response.data.data.idCardPos === '' ? '' : response.data.data.idCardPos,
            idCardNeg: response.data.data.idCardNeg === undefined || response.data.data.idCardNeg === '' ? '' : response.data.data.idCardNeg,
            id: response.data.data.id, // 身份证号
            idValidDate: response.data.data.idValidDate, // 身份证有效日期
            driverLic: response.data.data.driverLic === undefined || response.data.data.driverLic === '' ? '' : response.data.data.driverLic,
            licCode: response.data.data.licCode, // 驾驶证编号
            licTime: response.data.data.licTime, // 初次领证日期
            licType: response.data.data.licType, // 准驾车型
            licYears: response.data.data.licYears, // 有效日期
            lockedFlag: response.data.data.lockedFlag, // 是否失效
            userCode: '15001962939'
          }
          _this.startendTime = _this.postForm.idValidDate !== undefined && _this.postForm.idValidDate !== '' ? _this.postForm.idValidDate.split('&') : ''
          _this.driverPicture = []
          if (_this.postForm.driverPicture !== '') {
            _this.driverPicture.push({
              name: _this.ftpurl + _this.postForm.driverPicture,
              url: _this.ftpurl + _this.postForm.driverPicture
            })
          }
          _this.idCardNeg = []
          if (_this.postForm.idCardNeg !== '') {
            _this.idCardNeg.push({
              name: _this.ftpurl + _this.postForm.idCardNeg,
              url: _this.ftpurl + _this.postForm.idCardNeg
            })
          }
          _this.idCardPos = []
          if (_this.postForm.idCardPos !== '') {
            _this.idCardPos.push({
              name: _this.ftpurl + _this.postForm.idCardPos,
              url: _this.ftpurl + _this.postForm.idCardPos
            })
          }
          _this.driverLic = []
          if (_this.postForm.driverLic !== '') {
            _this.driverLic.push({
              name: _this.ftpurl + _this.postForm.driverLic,
              url: _this.ftpurl + _this.postForm.driverLic
            })
          }
          _this.createUser = response.data.data.createUser // 创建人
          _this.createTime = response.data.data.createTime // 创建时间
        } else {
          _this.$message({
            type: 'warning',
            message: response.data.msg
          })
        }
      })
    } else {
      _this.createUser = cookie.getcookie('TMS-UserCode')// 创建人
      _this.createTime = _this.time()
    }
  },
  methods: {
    numberChange(val) {
      if (this.postForm.licYears !== '') {
        this.postForm.licYears = (this.postForm.licYears.toString().match(/\d+(\.\d{0,1})?/) || [''])[0] * 1
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
    beforeUpload(file, fileList) {
      var type = file.type
      if (type.indexOf('jpg') === -1 && type.indexOf('jpeg') === -1 && type.indexOf('png') === -1) {
        this.$message({
          type: 'warning',
          message: '上传正确的图片格式'
        })
        return false
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleRemove(file, fileList) {
      this.postForm.driverPicture = ''
    },
    handleRemove1(file, fileList) {
      this.postForm.idCardPos = ''
    },
    handleRemove2(file, fileList) {
      this.postForm.idCardNeg = ''
    },
    handleRemove3(file, fileList) {
      this.postForm.driverLic = ''
    },
    imgSuccess(res, file, fileList) {
      var _this = this
      if (res.success === true) {
        _this.$message({
          type: 'success',
          message: '上传成功'
        })
        _this.postForm.driverPicture = res.data.fileUrl
      } else {
        _this.$message({
          type: 'warning',
          message: '上传失败'
        })
      }
    },
    imgSuccess1(res, file, fileList) {
      var _this = this
      if (res.success === true) {
        _this.$message({
          type: 'success',
          message: '上传成功'
        })
        _this.postForm.idCardPos = res.data.fileUrl
        console.log(_this.idCardPos)
      } else {
        _this.$message({
          type: 'warning',
          message: '上传失败'
        })
      }
    },
    imgSuccess2(res, file, fileList) {
      var _this = this
      if (res.success === true) {
        _this.$message({
          type: 'success',
          message: '上传成功'
        })
        _this.postForm.idCardNeg = res.data.fileUrl
      } else {
        _this.$message({
          type: 'warning',
          message: '上传失败'
        })
      }
    },
    imgSuccess3(res, file, fileList) {
      var _this = this
      if (res.success === true) {
        _this.$message({
          type: 'success',
          message: '上传成功'
        })
        _this.postForm.driverLic = res.data.fileUrl
      } else {
        _this.$message({
          type: 'warning',
          message: '上传失败'
        })
      }
    },
    save: Debounce(function() {
      var _this = this
      if (_this.startendTime !== '') {
        _this.postForm.idValidDate = _this.startendTime.join('&')
      }
      if (_this.postForm.driverName === '') {
        _this.$message({
          type: 'warning',
          message: '请填写司机名称'
        })
        return false
      }
      if (!both.telCheck(_this.postForm.mobile)) {
        _this.$message({
          type: 'warning',
          message: '请填写正确的手机号码'
        })
        return false
      }
      if (_this.postForm.driverName === '') {
        _this.$message({
          type: 'warning',
          message: '请填写司机名称'
        })
        return false
      }
      if (_this.postForm.driverType === '') {
        _this.$message({
          type: 'warning',
          message: '请选择司机类型'
        })
        return false
      }
      if (_this.postForm.driverStatus === '') {
        _this.$message({
          type: 'warning',
          message: '请选择司机状态'
        })
        return false
      }
      if (_this.postForm.idCardPos === '') {
        _this.$message({
          type: 'warning',
          message: '请上传身份证正面照片'
        })
        return false
      }
      if (_this.postForm.idCardNeg === '') {
        _this.$message({
          type: 'warning',
          message: '请上传身份证反面照片'
        })
        return false
      }
      if (!both.idCardCheck(_this.postForm.id)) {
        _this.$message({
          type: 'warning',
          message: '请填写正确的身份证号'
        })
        return false
      }
      if (_this.postForm.idValidDate === '') {
        _this.$message({
          type: 'warning',
          message: '请选择身份证有效日期'
        })
        return false
      }
      if (_this.postForm.driverLic === '') {
        _this.$message({
          type: 'warning',
          message: '请上传驾驶证照片'
        })
        return false
      }
      if (_this.postForm.licCode === '') {
        _this.$message({
          type: 'warning',
          message: '请填写驾驶证编号'
        })
        return false
      }
      if (_this.postForm.licCode) {
        var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
        if (reg.test(_this.postForm.licCode)) {
          _this.$message({
            type: 'warning',
            message: '驾驶证编号不能输入汉字'
          })
          return false
        }
      }
      if (_this.postForm.licTime === '') {
        _this.$message({
          type: 'warning',
          message: '请选择初次领证日期'
        })
        return false
      }
      if (_this.postForm.licYears === '' || _this.postForm.licYears === 0) {
        _this.$message({
          type: 'warning',
          message: '请填写有效期限'
        })
        return false
      }
      addOrUpdateDriver(this.postForm).then(response => {
        if (response.data.success === true) {
          _this.$message({
            type: 'success',
            message: response.data.msg
          })
          closeSelectedTag.closedPath(_this, '/lookDriverMessage', '/basicDataCarrier')
          if (_this.source === 0) {
            _this.postForm = {
              pkDriver: '',
              driverCode: '', // 司机编号
              driverName: '', // 司机名称
              mobile: '', // 手机号码
              driverType: '', // 司机类型
              driverStatus: '0', // 司机状态
              checkStatus: '2', // 审核状态
              driverPicture: '',
              idCardPos: '',
              idCardNeg: '',
              id: '', // 身份证号
              idValidDate: '', // 身份证有效日期
              driverLic: '',
              licCode: '', // 驾驶证编号
              licTime: '', // 初次领证日期
              licType: '', // 准驾车型
              licYears: '', // 有效日期
              lockedFlag: 'N'// 是否失效
            }
            _this.driverPicture = []
            _this.idCardPos = []
            _this.idCardNeg = []
            _this.driverLic = []
            _this.createUser = cookie.getcookie('TMS-UserCode')// 创建人
            _this.createTime = _this.time()
          }
        } else {
          _this.$message({
            type: 'warning',
            message: response.data.msg
          })
        }
      })
    })
  }
}
</script>
<style>
  .timeReat{
    background: lightyellow!important;
  }
  .timeReat input{
    background: lightyellow!important;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../styles/mixin.scss";
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
