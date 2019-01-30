<template>
  <div>
    <el-upload
      ref="upload"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      :auto-upload="false"
      :action="action"
      :on-success="handleSuccess"
      :on-error="handleError"
      name="file"
      class="upload-demo"
      drag>
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传Excel文件,<a :href="downloadUrl" class="link-type">下载模板</a></div>
    </el-upload>
    <!-- <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      拖动Excel文件到这里或者
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">点击上传</el-button>
    </div> -->
  </div>
</template>

<script>

export default {
  props: {
    afterSuccess: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      action: null,
      fileList: [],
      downloadUrl: null
    }
  },
  created() {
    this.downloadUrl = process.env.BASE_API + '/poi/templateDownload.do?fileName=订单模板'
    this.action = process.env.BASE_API + '/poi/importInvoice.do?userCode=15001962939'
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleSuccess(response) {
      // debugger
      console.log(response)
      if (response.success) {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        if (this.afterSuccess) {
          this.afterSuccess()
        }
      } else {
        this.$message({
          type: 'error',
          message: '导入失败!' + response.msg
        })
      }
      this.fileList = this.fileList.slice(-1)
    },
    handleError(err) {
      // debugger
      console.log(err)
      // this.$message({
      //   type: 'error',
      //   message: '操作成功!'
      // })
    },
    beforeAvatarUpload(file) {
      const isEXCEL = this.isExcel(file)
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isEXCEL) {
        this.$message.error('上传文件只能是 Excel 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isEXCEL && isLt2M
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>
