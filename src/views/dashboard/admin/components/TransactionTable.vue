<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="车牌号" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="起始地" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="目的地" width="100" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status | statusFilter"> {{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="预计到达" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="总里程" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="剩余里程" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="进度" width="200" align="center">
      <template >
        <div class="progress-item">
          <el-progress :percentage="18"/>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/transaction'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.progress-item {
  margin-bottom: 10px;
  font-size: 14px;
}
</style>

