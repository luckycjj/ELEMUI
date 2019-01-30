<template>
  <div class="">
    <el-dialog :visible.sync="visible" title="附件" width="40%" @close="close">
      <div class="portlet box">
        <div class="portlet-title blue" style="border-radius:0">
          <div class="caption">
            <i class="fa fa-gift"/>
            附件列表</div>
        </div>
        <div class="portlet-body">
          <el-button class="btnGreen" size="small" @click="addGoodspack()">新增</el-button>
          <div style="padding:10px">
            <el-table :data="goodList.data" border style="width: 100%" highlight-current-row >
              <el-table-column
                v-for="(v,i) in goodList.columns"
                :key="i"
                :prop="v.field"
                :label="v.title"
                :min-width="v.width"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-select v-if="i===0" v-model="goodList.sel[v.field]" placeholder="请选择" disabled>
                      <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"/>
                    </el-select>
                    <!-- <span v-else-if="i===1" >
                      <span v-for="(item,i) in scope.row.urlList" :key="i" style="margin-right:3px">
                        <img :src="ftpurl+item" class="imgSize">
                      </span>
                    </span> -->
                    <el-upload
                      v-else
                      :before-upload="beforeUpload"
                      :on-success="successUpload"
                      :on-remove="handleRemove"
                      :action="address"
                      :headers="myHeaders"
                      :file-list="scope.row.fileList"
                      :accept="'image/jpeg,image/jpg,image/png'"
                      class="upload-demo"
                      multiple>
                      <el-button size="small" type="primary" @click="saveList(scope.$index)">点击上传</el-button>
                    </el-upload>
                  </span>
                  <span v-else>
                    <span v-if="i===0">{{ scope.row[v.field] }}</span>
                    <span v-else >
                      <span v-for="(item,i) in scope.row.urlList" :key="i" >
                        <el-popover
                          placement="bottom"
                          title=""
                          trigger="hover">
                          <img :src="ftpurl+item" style="max-width:800px;max-height:600px">
                          <img slot="reference" :src="ftpurl+item" class="imgSize" style="margin-right:5px">
                        </el-popover>
                        <!-- <img :src="ftpurl+item" class="imgSize"> -->
                      </span>
                    </span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <span
                    class="el-tag el-tag--mini"
                    style="cursor: pointer;"
                    @click="editGoodspack(scope.row,scope.$index,true)"
                  >{{ scope.row.isSet?"保存":"编辑" }}</span>
                  <span
                    v-if="!scope.row.isSet"
                    class="el-tag el-tag--danger el-tag--mini"
                    style="cursor: pointer;"
                    @click="deleteGoodspack(scope.$index, goodList.data)"
                  >删除</span>
                  <span
                    v-else
                    class="el-tag el-tag--danger el-tag--mini"
                    style="cursor: pointer;"
                    @click="editGoodspack(scope.row,scope.$index,false)"
                  >取消</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { getToken, getSysCode, getUserCode } from '@/utils/auth'
export default {
  name: 'UploadAttachment',
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
      goodList: {
        sel: null, // 选中行
        columns: [
          { field: 'originType', title: '附件类型', width: 100 },
          { field: 'url', title: '上传附件', width: 150 }
        ],
        data: []
      },
      typeList: [
        {
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
        }
      ],
      loading: false,
      address: process.env.BASE_API + '/file/upload.do',
      index: '',
      ftpurl: 'http://39.98.34.129/images',
      dialogImageUrl: '',
      imgList: [],
      fileList: [],
      url: []
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
    show(val) {
      this.visible = val// 新增result的watch，监听变更并同步到myResult上
    },
    opinion(val) {
      // console.log(val)

      this.goodList.data = []

      for (const item of val) {
        var list = item.url.split(',')
        var list2 = []
        for (var x = 0; x < list.length; x++) {
          var json = {
            name: list[x],
            url: this.ftpurl + list[x]
          }
          list2.push(json)
        }
        this.goodList.data.push({ 'originType': this.changeType(item.originType),
          'url': item.url,
          'urlList': item.url.split(','),
          'fileList': list2,
          'isSet': false
        })
      }

      // console.log(this.goodList.data)
      // this.goodList.data = val
    }
  },
  created() {
  },
  methods: {
    saveList(val) {
      this.index = val
    },
    close() {
      this.$emit('update:show', false)
    },
    save() {
      // debugger
      // console.log(this.onselect)
      if (this.onselect) {
        this.onselect(this.goodList.data)
        this.$emit('update:show', false)
      } else {
        this.$emit('update:show', false)
      }
    },
    addGoodspack() {
      for (const i of this.goodList.data) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      // debugger
      for (const item of this.typeList) {
        for (const i of this.goodList.data) {
          if (item.label === i.originType) {
            item.disabled = true
          }
        }
      }
      const j = {
        originType: '附件',
        url: '',
        urlList: [],
        fileList: [],
        isSet: true
      }
      this.goodList.data.push(j)
      this.goodList.sel = JSON.parse(JSON.stringify(j))
    },
    editGoodspack(row, index, cg) {
      // 点击修改 判断是否已经保存所有操作
      for (const i of this.goodList.data) {
        if (i.isSet && i.isSet !== row.isSet) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }

      // 是否是取消操作
      if (!cg) {
        if (this.goodList.sel.isSet) this.goodList.data.splice(index, 1)
        return (row.isSet = !row.isSet)
      }

      // 提交数据
      // debugger
      if (row.isSet) {
        const data = JSON.parse(JSON.stringify(this.goodList.sel))
        for (const k in data) row[k] = data[k]

        if (!row.originType) {
          return this.$message.warning('请确认附件类型')
        }
        // debugger
        if (this.imgList.length <= 0) {
          this.$message.warning('请上传附件')
          // row.isSet = true
          return false
        }

        this.goodList.data[index].urlList = []
        this.goodList.data[index].fileList = []
        for (const item of this.imgList) {
          console.log(item.response)
          // debugger
          if (item.response) {
            this.goodList.data[index].urlList.push(item.response.data.fileUrl)
            this.goodList.data[index].fileList.push({ name: item.response.data.fileUrl, url: this.ftpurl + item.response.data.fileUrl })
          } else {
            this.goodList.data[index].urlList.push(item.name)
            this.goodList.data[index].fileList.push({ name: item.name, url: item.url })
          }
        }

        this.goodList.data[index].url = this.goodList.data[index].urlList.join(',')
        row.isSet = false
      } else {
        // for (const item of this.typeList) {
        //   for (const i of this.goodList.data) {
        //     if (item.label === i.originType) {
        //       item.disabled = true
        //     }
        //   }
        // }
        for (var i = 0; i < this.goodList.data.length; i++) {
          if (i === index) {
            break
          } else {
            for (const item of this.typeList) {
              if (item.label === this.goodList.data[i].originType) {
                item.disabled = true
              }
            }
          }
        }
        this.goodList.sel = JSON.parse(JSON.stringify(row))
        row.isSet = true
      }

      this.$forceUpdate()
    },
    deleteGoodspack(index, rows) {
      rows.splice(index, 1)
    },
    handleRemove(file, fileList) {
      this.imgList = fileList
      console.log(file, fileList)
    },
    successUpload(response, file, fileList) {
      // console.log(response, file, fileList)
      this.imgList = fileList
    },
    beforeUpload(file) {
      // console.log(file)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!this.fileType(file.name)) {
        this.$message.warning('只能上传jpg/png文件')
        return false
      }
      if (!isLt2M) {
        this.$message.warning('上传头像图片大小不能超过 2MB!')
        return false
      }
    },
    fileType(data) {
      return /\.(jpg|png|jpeg)$/.test(data)
    },
    fileXls(data) {
      return /\.(xlsx|xls|csv)$/.test(data)
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
  max-width: 40px;
}
// .el-upload--picture-card {
//   width:30px !important;
//   height: 30px !important;
//   line-height:30px !important;
// }
</style>

