<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="未核销" name="1">
        <pay-noverification/>
      </el-tab-pane>
      <el-tab-pane label="已核销" name="2">
        <pay-verification/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PayNoverification from '../components/PayNoverification'
import PayVerification from '../components/PayVerification'

export default {
  name: 'Payablebill',
  components: { PayNoverification, PayVerification },
  data() {
    return {
      activeName: '1'
    }
  },
  created() {
    this.activeName = sessionStorage.getItem('TARGET' + this.$route.path) === null ? '1' : sessionStorage.getItem('TARGET' + this.$route.path)
  },
  methods: {
    handleClick(tab, event) {
      sessionStorage.setItem('TARGET' + tab.$route.path, event.target.id.split('-')[1])
    }

  }
}
</script>
