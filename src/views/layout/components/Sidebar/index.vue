<template>
  <sticky>
    <div class="page-header-menu" style="display: block;">
      <div class="hor-menu">
        <ul class="nav navbar-nav" >
          <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
        </ul>
      </div>
    </div>
  </sticky>
</template>
<script>
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky' // 粘性header组件
import { generateTitle } from '@/utils/i18n'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem, Sticky },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    generateTitle
  }
}
</script>
