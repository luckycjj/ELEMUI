<template>
  <div :class="classObj" class="app-wrapper">
    <navbar/>
    <sidebar :style="isDashboard" class="sidebar-container"/>
    <div class="main-container">
      <tags-view/>
      <app-main/>
    </div>
    <a id="download_a"/>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { im } from '../../utils/IM'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        dashboard: this.$route.path === '/dashboard',
        withoutAnimation: this.sidebar.withoutAnimation
      }
    },
    isDashboard() {
      console.log(this.$route.path)
      return (this.$route.path === '/dashboard' || this.$route.path === '/booking/list') ? 'height:56px;' : 'height:106px;'
    }
  },
  mounted() {
    im.init(this)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
