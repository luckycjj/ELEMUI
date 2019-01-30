<template>
  <div class="">
    <el-dialog :visible.sync="visible" title="选择承运商" @close="close">
      <el-form :model="listQuery" :inline="true" >
        <el-form-item label-width="100px" label="承运商名称：" >
          <el-input v-model="listQuery.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label-width="100px" label="运货类型：" >
          <el-radio v-model="listQuery.trans_type" label="1">普货</el-radio>
          <el-radio v-model="listQuery.trans_type" label="2">冷链</el-radio>
          <el-radio v-model="listQuery.trans_type" label="3">危险品</el-radio>
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">{{ $t('table.search') }}</el-button>
      </el-form>
      <el-table ref="multipleTable" :data="list" border >
        <el-table-column label="选择" width="55" align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.row.pk_carrier" v-model="selectRadio" @change.native="selectDriverRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column property="business_type" label="业务类型" min-width="150"/>
        <el-table-column property="carr_name" label="承运商" min-width="200"/>
        <el-table-column property="contact" label="负责人" min-width="150"/>
        <el-table-column property="mobile" label="手机" min-width="150"/>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:show', false)">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { carrierTable } from '@/api/stow'
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
    onselect: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      visible: this.show,
      multipleSelection: null,
      selectRadio: '',
      listQuery: {
        userCode: 'admin',
        business_type: '',
        pk_carrier: '',
        trans_type: ''
      },
      list: null
    }
  },
  watch: {
    show(val) {
      this.visible = val// 新增result的watch，监听变更并同步到myResult上
    }
  },
  created() {
    this.getList()
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$refs.multipleTable.clearSelection()
    },
    selectDriverRow(index, row) {
      this.multipleSelection = row
    },
    getList() {
      this.listLoading = true
      carrierTable(this.listQuery).then(response => {
        this.list = response.data.datas
        this.total = response.data.totalCount

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    close() {
      this.reload()
      this.$emit('update:show', false)
    },
    save: Debounce(function() {
      if (this.onselect) {
        this.onselect(this.multipleSelection)
      }
      this.$emit('update:show', false)
    })
  }
}
</script>

