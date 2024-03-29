<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!--侧边栏-->
    <sidebar class="sidebar-container" />
    <!--主内容区-->
    <div class="main-container">
      <!--顶部面包屑导航-->
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <!--主内容展示区-->
      <app-main ref="main" />
      <Tabs :app-main-height="appMainHeight" @resetAppMainHeight="resetAppMainHeight" />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapActions } from 'vuex'
import Tabs from '@/components/Tabs'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Tabs
  },
  mixins: [ResizeMixin],
  data() {
    return {
      oldMainHeight: 0, // 定义一个变量，存放app-main元素调整前的高度
      oldBottomContentHeight: 0, // 定义一个变量，存放bottom-content元素调整前的高度
      appMainHeight: 0 // appMainHeight初始高度
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        // 没有动画？？？
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    this.fetchData()
    this.$store.commit('currentNamespace/SETCURRENTNAMESPACE', this.ns)
    this.getAppMainHeight()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    ...mapActions('namespacesInfo', { fetchData: 'getNamespacesInfo' }),
    getAppMainHeight() {
      this.appMainHeight = this.$refs.main.$refs['app-main'].offsetHeight
    },
    resetAppMainHeight(value) {
      const appMain = this.$refs.main.$refs['app-main']
      if (value >= 0) {
        appMain.style.height = value + 'px'
        this.getAppMainHeight()
      } else {
        appMain.style.height = `calc(100vh - 86px)`
        this.getAppMainHeight()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
//@import "@/styles/mixin.scss";
//@import "@/styles/variables.scss";
@import "src/styles/mixin";
@import "src/styles/variables";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
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

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}

.main-container {
  position: relative;
}

</style>
