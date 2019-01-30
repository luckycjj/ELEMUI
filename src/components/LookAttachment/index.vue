<template>
  <div class="">
    <el-dialog :visible.sync="visible" title="附件" width="30%" @close="close">
      <div class="portlet box">
        <div class="portlet-title blue" style="border-radius:0">
          <div class="caption">
            <i class="fa fa-gift"/>
            附件列表</div>
        </div>
        <div class="portlet-body">
          <div style="padding:10px">
            <el-table :data="goodList" border style="width: 100%" highlight-current-row>
              <el-table-column prop="originType" label="附件类型" min-width="80"/>
              <el-table-column prop="url" label="上传附件" min-width="150">
                <template slot-scope="scope">
                  <span v-for="(item,i) in scope.row.url" :key="i">
                    <el-popover
                      placement="bottom"
                      title=""
                      trigger="hover">
                      <img :src="ftpurl+item" style="max-width:800px;max-height:600px">
                      <img slot="reference" :src="ftpurl+item" :alt="item" class="imgSize" style="margin-right:5px">
                    </el-popover>
                  </span>

                  <!-- <span v-if="fileType(scope.row.httpUrl)">
                    <img :src="scope.row.httpUrl" class="imgSize">
                  </span>
                  <span v-else>其他类型</span> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'LookAttachment',
  components: { request },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    onselect: {
      type: Function,
      default: null
    },
    opinion: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      visible: this.show,
      goodList: [],
      typeList: [{
        value: '提货',
        label: '提货'
      }, {
        value: '到货',
        label: '到货'
      }, {
        value: '签收',
        label: '签收'
      }, {
        value: '回单',
        label: '回单'
      }, {
        value: '异常反馈',
        label: '异常反馈'
      }, {
        value: '附件',
        label: '附件'
      }],

      loading: false,
      ftpurl: 'http://39.98.34.129/images'
    }
  },
  watch: {
    show(val) {
      this.visible = val// 新增result的watch，监听变更并同步到myResult上
    },
    // ftp(val) {
    //   console.log(val)
    //   this.ftpurl = val
    // },
    opinion(val) {
      // console.log(val)
      this.goodList = []

      for (const item of val) {
        this.goodList.push({ 'originType': this.changeType(item.originType),
          'url': item.url.split(','),
          'httpUrl': this.ftpurl + item.url
        })
      }

      // console.log(this.goodList.data)
      // this.goodList.data = val
    }
  },
  created() {
  },
  methods: {

    // saveList(val) {
    //   this.index = val
    // },
    close() {
      this.$emit('update:show', false)
    },
    fileType(data) {
      return /\.(jpg|png|pdf)$/.test(data)
    },
    changeType(type) {
      if (type === '提货' || type === '0') {
        return '提货'
      } else if (type === '到货' || type === '1') {
        return '到货'
      } else if (type === '签收' || type === '2') {
        return '签收'
      } else if (type === '回单' || type === '3') {
        return '回单'
      } else if (type === '异常反馈' || type === '4') {
        return '异常反馈'
      } else {
        return '附件'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.box{
  border: 1px solid #60aee4;
  border-top: 0;
    .blue{
       background-color: #3598dc;
       border-top: 0;
       border-bottom: 0;
       padding: 0 10px;
       margin-bottom: 0;
       color: #fff;
    }
    .btnGreen{
      margin: 10px;
      color: #fff;
      background-color: #32c5d2;
      border-color: #32c5d2;
    }
}
.imgSize{
  height: 40px;
  max-width: 80px;
}
</style>

