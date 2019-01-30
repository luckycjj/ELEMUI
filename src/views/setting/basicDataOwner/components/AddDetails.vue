<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <el-form ref="addForm" :model="addForm" label-width="80px">
        <div class="portlet light">
          <div class="note note-info">
            <span>地址详情</span>
            <span style="float:right" class="link-type" @click="editAddr">编辑</span>
          </div>
          <div class="portlet-body form">
            <!-- BEGIN FORM-->
            <div class="form-body">
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">地址编号：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.addr_code }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">省份：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.pk_province }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="6" :sm="6" :lg="7" class="control-label">市：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.pk_city }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">区：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.pk_area }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">详细地址：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.detail_addr }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="6" :sm="6" :lg="7" class="control-label">地址名称：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.addr_name }}</el-col>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">联系人：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.contact }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">联系电话：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.mobile }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">是否失效：</el-col>
                    <el-switch
                      v-model="addForm.locked_flag"
                      active-value="Y"
                      inactive-value="N"
                      disabled/>
                  </el-col>
                </div>
              </el-row>
              <el-row :gutter="24">
                <div class="form-group">

                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="7" :sm="7" :lg="7" class="control-label">录入人：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.create_user }}</el-col>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-col :xs="6" :sm="6" :lg="7" class="control-label">录入时间：</el-col>
                    <el-col :xs="17" :sm="17" :lg="17">{{ addForm.create_time }}</el-col>
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
import { addrList } from '@/api/setting'
export default {
  name: 'CarInfoDetails',
  components: { parseTime },
  props: {

  },
  data() {
    return {
      pk_address: '',
      addForm: {
        addr_code: '',
        pk_province: '',
        pk_city: '',
        pk_area: '',
        detail_addr: '',
        addr_name: '',
        contact: '',
        mobile: '',
        locked_flag: 'N'
      }

    }
  },
  computed: {},
  created() {
    this.pk_address = this.$route.params.pk_address
    this.$nextTick(() => {
      this.getAddInfo()
    })
  },
  methods: {
    getAddInfo() {
      const data = {
        pk_address: this.pk_address
      }
      addrList(data).then(response => {
        // console.log(response)
        if (response.data.success) {
          this.addForm = Object.assign({}, response.data.records[0])
        }
      })
    },
    editAddr() {
      this.$router.push({ name: 'EditAddinfo', params: { 'addInfo': this.addForm }})
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
  }
}
</style>
