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
          <el-form-item label="客户编号">
            <el-input v-model="postForm.custCode" :disabled="true" placeholder="客户编号"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="公司名称">
            <el-input v-if="source == 0 || source == 1" :maxlength="100" v-model="postForm.corpName" class="required" placeholder="公司名称"/>
            <el-input v-if="source == 2" v-model="postForm.corpName" :disabled="true" placeholder="公司名称"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="公司简称">
            <el-input v-if="source === 0 || source === 1" :maxlength="100" v-model="postForm.corpAbbreName" placeholder="公司简称"/>
            <el-input v-else v-model="postForm.corpAbbreName" :disabled="true" placeholder="公司简称"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="公司地址">
            <el-input v-if="source === 0 || source === 1" :maxlength="100" v-model="postForm.corpAddr" placeholder="公司地址"/>
            <el-input v-else v-model="postForm.corpAddr" :disabled="true" placeholder="公司地址"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="联系人">
            <el-input v-if="source === 0 || source === 1" :maxlength="100" v-model="postForm.contact" placeholder="联系人"/>
            <el-input v-else v-model="postForm.contact" :disabled="true" placeholder="联系人"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="联系电话">
            <el-input v-if="source === 0 || source === 1" :maxlength="11" v-model="postForm.contactMobile" placeholder="联系电话"/>
            <el-input v-else v-model="postForm.contactMobile" :disabled="true" placeholder="联系电话"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="公司邮箱">
            <el-input v-if="source === 0 || source === 1" :maxlength="100" v-model="postForm.email" placeholder="公司邮箱"/>
            <el-input v-else v-model="postForm.email" :disabled="true" placeholder="公司邮箱"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="source === 1 || source === 2" :gutter="24">
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="创建人">
            <el-input v-model="createUser" :disabled="true" placeholder="创建人"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="6">
          <el-form-item label="创建时间">
            <el-input v-model="createTime" :disabled="true" placeholder="创建时间"/>
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
import { addOrUpdateCust, detailCust } from '@/api/setting'
import { both } from '../../../utils/dateJS'
import { cookie } from '../../../utils/cookie'
import { Debounce } from '@/utils/debounce'
import { closeSelectedTag } from '@/utils/closedPath'
export default {
  name: 'LookCust',
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
      driverlic_type: [{
        value: 'C3',
        label: 'C3'
      }, {
        value: 'A2',
        label: 'A2'
      }, {
        value: 'M',
        label: 'M'
      }, {
        value: 'C1',
        label: 'C1'
      }, {
        value: 'B1',
        label: 'B1'
      }, {
        value: 'C2',
        label: 'C2'
      }, {
        value: 'B2',
        label: 'B2'
      }, {
        value: 'A1',
        label: 'A1'
      }, {
        value: 'A3',
        label: 'A3'
      }],
      startendTime: '',
      createUser: '',
      createTime: '',
      postForm: {
        pkCustomer: '',
        custCode: '', // 编号
        corpName: '', // 公司名称
        corpAbbreName: '', // 公司简称
        corpAddr: '', // 公司地址
        contact: '', // 联系人
        contactMobile: '', // 联系电话
        email: ''// 邮箱
      },
      driverPicture: [],
      idCardPos: [],
      idCardNeg: [],
      driverLic: [],
      type: 0,
      dialogFormVisible: false,
      rules: {},
      source: 0
    }
  },
  created() {
    var _this = this
    var fullPath = _this.$route.fullPath
    var list = fullPath.split('/')
    var number = list[list.length - 1].split('?')[0]
    _this.source = _this.$route.query.type * 1
    if (number.indexOf('new') === -1) {
      detailCust({
        pkCustomer: number
      }).then(response => {
        if (response.data.success === true) {
          _this.postForm = {
            pkCustomer: response.data.data.pkCustomer, // 司机编号
            custCode: response.data.data.custCode, // 司机编号
            corpName: response.data.data.corpName, // 司机名称
            corpAbbreName: response.data.data.corpAbbreName, // 手机号码
            corpAddr: response.data.data.corpAddr, // 司机类型
            contact: response.data.data.contact, // 司机状态
            contactMobile: response.data.data.contactMobile, // 审核状态
            email: response.data.data.email
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
      _this.createUser = cookie.getcookie('TMS-UserCode') // 创建人
      _this.createTime = _this.time()
    }
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
    save: Debounce(function() {
      var _this = this
      if (_this.postForm.corpName === '') {
        _this.$message({
          type: 'warning',
          message: '请填写公司名称'
        })
        return false
      }
      if (!both.telCheck(_this.postForm.contactMobile) && _this.postForm.contactMobile !== '') {
        _this.$message({
          type: 'warning',
          message: '请填写正确的联系电话'
        })
        return false
      }
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (!myreg.test(_this.postForm.email) && _this.postForm.email !== '') {
        _this.$message({
          type: 'warning',
          message: '请填写正确的邮箱'
        })
        return false
      }
      addOrUpdateCust(_this.postForm).then(response => {
        if (response.data.success === true) {
          _this.$message({
            type: 'success',
            message: response.data.msg
          })
          if (_this.source === 0) {
            _this.postForm = {
              pkCustomer: '',
              custCode: '', // 编号
              corpName: '', // 公司名称
              corpAbbreName: '', // 公司简称
              corpAddr: '', // 公司地址
              contact: '', // 联系人
              contactMobile: '', // 联系电话
              email: ''// 邮箱
            }
            console.log(_this.$route.query)
            _this.createUser = cookie.getcookie('TMS-UserCode') // 创建人
            _this.createTime = _this.time()
            closeSelectedTag.closedPath(_this, 'lookCustMessage', _this.$route.query.tpye2)
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
