<template>
  <!--tabs容器-->
  <div ref="tabs" class="tabs">
    <div
      ref="resizeBar"
      class="resizeBar"
      @mousedown="handleMouseDown"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
    />
    <div class="tabs-header">
      <!--标签页容器-->
      <div ref="navWrap" class="tabs-nav-wrap" :class="[scrollable ? 'tabs-nav-scrollable' : '']">
        <!--当宽度不够的时候显示左右按钮-->
        <div
          class="tabs-nav-previous"
          :class="[scrollable ? '' : 'tabs-nav-scroll-disabled']"
          @click="scrollPre"
        >
          <svg-icon class="left-icon" icon-class="left" />
        </div>
        <div
          class="tabs-nav-next"
          :class="[scrollable ? '' : 'tabs-nav-scroll-disabled']"
          @click="scrollNext"
        >
          <svg-icon class="right-icon" icon-class="right" />
        </div>
        <!--父元素宽度随页面宽度增加或减小-->
        <div ref="navScroll" class="tabs-nav-scroll clearfix">
          <!--子元素宽度始终为内容宽度,****需要设置浮动****，否则父元素随页面宽度缩小之后不会出现滚动条-->
          <div ref="nav" class="tabs-nav" :style="navStyle">
            <!--底部条-->
            <div class="tabs-bar" :style="barStyle" />
            <!--标签头label-->
            <div
              v-for="item in tabList"
              :key="item.id"
              class="tabs-tab"
              @click="handleChange(item.id)"
            >
              <div class="tab-title" :title="[ item.type === 'create' ? 'create resource' : item.resourceType + ':' + item.resourceName]">
                <template v-if="item.type === 'create'">
                  create resource
                </template>
                <template v-else>
                  {{ item.resourceType }}:{{ item.resourceName }}
                </template>
              </div>
              <!--阻止el-icon-close点击之后冒泡，使用@click.stop-->
              <span class="el-icon-close" @click.stop="closeTab(item.id)" />
            </div>
          </div>
        </div>
      </div>
      <!--添加-->
      <div style="flex: 1;">
        <div ref="add" class="add" @click="handleDropMenu">
          <svg-icon class="add-icon" icon-class="add" />
          <ul v-show="showDropMenu" ref="drop-menu" class="drop-menu">
            <li @click.stop="createResource">
              <svg-icon class="edit-icon" icon-class="edit" />
              Create resource
            </li>
            <li @click.stop="createTerminal">
              <svg-icon class="terminal-icon" icon-class="terminal" />
              Terminal session
            </li>
          </ul>
        </div>
      </div>
      <!--最大化/最小化-->
      <div v-show="isShow" class="full">
        <svg-icon class="full-icon" :icon-class="fullScreenIcon" @click="handleFullScreen" />
      </div>
      <!--    <div><svg-icon icon-class="minimize" /></div>-->
      <!--展开/收起-->
      <div v-show="isShow" class="up-down" @click="handleUpDown">
        <svg-icon class="up-down-icon" :icon-class="upDownIcon" />
      </div>
    </div>
    <!--活动标签内容-->
    <div ref="tab-content" class="tab-content">
      <!--      &lt;!&ndash;查看和编辑&ndash;&gt;-->
      <!--      <YAMLModify v-if="currentTab.type === 'edit' && currentTab.id === activeKey" :key="currentTab.id" :current-tab="currentTab" @close="closeTab" />-->
      <!--      &lt;!&ndash;日志&ndash;&gt;-->
      <!--      <PodLog v-else-if="currentTab.type === 'log' && currentTab.id === activeKey" :key="currentTab.id" :current-tab="currentTab" @close="closeTab" />-->
      <!--      &lt;!&ndash;终端&ndash;&gt;-->
      <!--      <PodTerminal v-else-if="currentTab.type === 'terminal' && currentTab.id === activeKey" :key="currentTab.id" :current-tab="currentTab" :tabs-height="tabsHeight" @close="closeTab" />-->
      <!--      &lt;!&ndash;新建资源&ndash;&gt;-->
      <!--      <YAMLCreator v-else-if="currentTab.type === 'create' && currentTab.id === activeKey" :key="currentTab.id" :current-tab="currentTab" @close="closeTab" />-->
      <!--实现组件缓存-->
      <keep-alive ref="ka">
        <!--key很重要，必须设置，这样才能保证component的唯一性，不设置会导致无法正确展示组件和组件内容-->
        <!--关闭tab后，无法清理inactive组件，目前还没找到解决办法！！！！！！！！！！，不影响使用-->
        <component :is="currentKeepAliveComponent" v-if="activeKey !== ''" :key="currentTab.id" :current-tab="currentTab" :tabs-height="tabsHeight" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
/*
* 需求：
* 1.添加tab时，活动标签overflow时，应该展示出来，不应该隐藏，相当于滚动条应该拉到最右边
* 2. 标签在滚动条边沿没有显示完全，在鼠标点击成为活动标签后应该自动滚动，并显示完全
* 3. placeholder不生效
* */

// 引入element-resize-detector来监听元素是否需要显示和隐藏图标
import elementResizeDetectorMaker from 'element-resize-detector'

import YAMLModify from '@/components/YAMLModify'
import PodTerminal from '@/components/PodTerminal'
import PodLog from '@/components/PodLog'
import YAMLCreator from '@/components/YAMLCreator'

export default {
  name: 'Tabs',
  components: {
    YAMLCreator,
    YAMLModify,
    PodTerminal,
    PodLog
  },
  props: {
    appMainHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 判断组件是否已挂载，解决computed中$refs报错的问题
      isMounted: false,
      // 活动标签
      activeKey: '',
      // 动态计算选中标签的宽度和偏移量
      barWidth: 0,
      barOffset: 0,
      // 宽度不够是否在tab栏显示左右图标
      scrollable: false,
      // 初始化.tabs-nav元素的transform属性
      navStyle: {
        transform: ''
      },
      // 底部工具栏展开/收起图标
      upDownIcon: 'up',
      // 全屏和展开/收起图标是否显示(也控制是否允许鼠标拖拽底部窗口)
      isShow: false,
      // 全屏图标
      fullScreenIcon: 'full',
      // 全屏前保留底部工具栏的高度，用于取消全屏时恢复该高度
      tmpHeight: 0,
      // 调整底部主窗口大小
      mousePosition: {
        startY: 0,
        endY: 0
      },
      // 该标志用于调整窗口鼠标按下时，获取一次app-main的高度,用于mousemove时的计算
      isGetAppMainHeight: true,
      // 是否展示drop menu
      showDropMenu: false,
      // 被选中的tab标签对应于tabList内的某个项
      currentTab: {},
      // 被关闭的tab索引
      closedTabIndex: '',
      // tabs的高度
      tabsHeight: '',
      // 当前keep-alive组件
      currentKeepAliveComponent: ''
    }
  },
  computed: {
    // 标签底部条样式
    barStyle() {
      return {
        width: `${this.barWidth}px`,
        // 水平移动
        transform: `translate3d(${this.barOffset}px, 0px, 0px)`
      }
    },
    // 获取标签列表
    tabList() {
      return this.$store.state.tabsList.tabsList
    },
    // 复制tabList
    tabListCopy() {
      return this.tabList.slice(0)
    }
  },
  watch: {
    // 活动标签变化时
    activeKey() {
      // 当activeKey不为空时
      if (this.activeKey) {
        // 更新bar
        this.updateBar()
        // 更新keep-alive组件
        this.tabList.forEach(item => {
          if (item.id === this.activeKey) {
            if (item.type === 'edit') {
              this.currentKeepAliveComponent = 'YAMLModify'
              this.currentTab = item
            } else if (item.type === 'log') {
              this.currentKeepAliveComponent = 'PodLog'
              this.currentTab = item
            } else if (item.type === 'terminal') {
              this.currentKeepAliveComponent = 'PodTerminal'
              this.currentTab = item
            } else if (item.type === 'create') {
              this.currentKeepAliveComponent = 'YAMLCreator'
              this.currentTab = item
            }
          }
        })
      }
    },
    // 直接监视tabList，newValue和oldValue都相同，无法看出变化
    // 可以在compute中定义一个副本，监控副本的变化
    tabListCopy: {
      deep: true,
      handler(newValue, oldValue) {
        // tabList成员从无到有以及从有到无变化时，底部导航栏的展示效果
        if (newValue.length > 0) {
          this.isShow = true

          // tabList成员增加或减少时，设置活动标签以及活动标签对应的内容
          if (newValue.length > oldValue.length) {
            // tabList成员增加时，始终新增的成员为活动标签
            this.activeKey = newValue.slice(-1)[0].id
            this.currentTab = newValue.slice(-1)[0]
          } else {
            // 执行closeTab后，也会触发tabList变化
            // 如果删除标签的索引为最后一个索引，设置被删除标签的前一个标签为活动标签；其他情况设置被删除标签的下一个标签为活动标签，展示活动标签内容
            if (this.closedTabIndex === (oldValue.length - 1) && newValue.length > 0) {
              this.activeKey = oldValue[this.closedTabIndex - 1].id
              this.currentTab = oldValue[this.closedTabIndex - 1]
            } else if (this.closedTabIndex < (oldValue.length - 1)) {
              this.activeKey = oldValue[this.closedTabIndex + 1].id
              this.currentTab = oldValue[this.closedTabIndex + 1]
            }
          }

          if (newValue.length === 1) {
            this.$emit('resetAppMainHeight', 300)
          }
        } else {
          this.$emit('resetAppMainHeight', -1)
          this.isShow = false
          this.activeKey = ''
          this.currentTab = {}
        }
      }
    },
    appMainHeight() {
      // document.body.clientHeight高度始终不变，可以作为可视高度
      this.tabsHeight = (document.body.clientHeight - this.appMainHeight - 115) + 'px'
      this.$refs.tabs.style.height = this.tabsHeight
    }
  },
  mounted() {
    // 初始化activeKey
    if (this.tabList.length > 0) {
      this.activeKey = this.tabList[0].id
      this.isShow = true
    } else {
      this.activeKey = ''
      this.isShow = false
    }
    // 创建监听
    this.observer = elementResizeDetectorMaker()
    this.observer.listenTo(this.$refs.navWrap, this.handleResize)
    // 监听click事件，用于关闭add按钮弹出的下拉菜单
    document.addEventListener('click', this.clickOutOfAdd)

    // 挂载标志位置为true
    this.isMounted = true
  },
  beforeDestroy() {
    // 销毁监听
    this.observer.removeListener(this.$refs.navWrap, this.handleResize)
    document.removeEventListener('click', this.clickOutOfAdd)
  },
  methods: {
    // 获取当前活动标签的相对于index为0的标签的水平偏移量，用于水平移动bar
    updateBar() {
      // 等待dom更新完毕后获取dom节点
      this.$nextTick(() => {
        // 当前选中的activeKey索引
        const index = this.tabList.findIndex(tab => tab.id === this.activeKey)
        // 获取navWrap元素下的所有tab元素
        const elemTabs = this.$refs.navWrap.querySelectorAll('.tabs-tab')
        // 获取当前选中的元素
        const elemTab = elemTabs[index]
        this.barWidth = elemTab ? elemTab.offsetWidth : 0
        // 计算需要移动的距离，当index > 0时进行累加
        if (index > 0) {
          let offset = 0
          for (let i = 0; i < index; i++) {
            offset += elemTabs[i].offsetWidth + 16
          }
          this.barOffset = offset
        } else {
          this.barOffset = 0
        }
      })
    },
    // 当鼠标点击tab标签时,将该标签设置为活动tab标签
    handleChange(id) {
      // 通过id标识活动标签
      this.activeKey = id
      // 通过id从tabList中检索活动标签内容
      this.tabList.forEach(item => {
        if (item.id === id) {
          this.currentTab = item
        }
      })
    },
    handleResize() {
      // 获取tab导航栏的实际宽度(包括overflow时的隐藏部分)
      const navWidth = this.$refs.nav.offsetWidth
      // 获取tab导航栏的可见宽度（不包括overflow部分）
      const scrollWidth = this.$refs.navScroll.offsetWidth
      if (scrollWidth < navWidth) {
        this.scrollable = true
      } else {
        this.scrollable = false
      }
      this.updateMove()
    },
    // 获取当前.tabs-nav元素transform属性中translateX的移动距离
    getCurrentScrollOffset() {
      // 其实就是data中的navStyle
      const { navStyle } = this
      const reg = /translateX\(-(\d+(\.\d+)*)px\)/
      // .tabs-nav元素左移其实就是.tabs-nav-scroll元素的滑块右移
      // console.log('正则匹配:', navStyle.transform.match(reg)) // ['translateX(-151px)', '151', undefined, index: 0, input: 'translateX(-151px)', groups: undefined]
      return navStyle.transform ? Number(navStyle.transform.match(reg)[1]) : 0
    },
    // 页面大小被调整时执行
    updateMove() {
      // 获取tab导航栏的实际宽度(包括overflow时的隐藏部分)
      const navWidth = this.$refs.nav.offsetWidth
      // 获取tab导航栏的可见宽度（不包括overflow部分）
      const scrollWidth = this.$refs.navScroll.offsetWidth
      const currentOffset = this.getCurrentScrollOffset()
      if (scrollWidth < navWidth) {
        if (navWidth - currentOffset < scrollWidth) {
          this.navStyle.transform = `translateX(-${navWidth - scrollWidth}px)`
        }
      } else {
        if (currentOffset > 0) {
          this.navStyle.transform = `translateX(-${0}px)`
        }
      }
    },
    scrollPre() {
      // 获取tab导航栏的可见宽度（不包括overflow部分）
      const containerWidth = this.$refs.navScroll.offsetWidth
      const currentOffset = this.getCurrentScrollOffset()
      // 如果为0，返回（退出）
      if (!currentOffset) return
      let newOffset = 0
      // 移动距离 > 导航栏可见宽度
      if (currentOffset > containerWidth) {
        // 点击一次，移动一个containerWidth的距离（有点绕）
        // newOffset=0就相当与回到初始位置
        newOffset = currentOffset - containerWidth
      }
      this.navStyle.transform = `translateX(-${newOffset}px)`
    },
    scrollNext() {
      // 获取tab导航栏的实际宽度(包括overflow时的隐藏部分)
      const navWidth = this.$refs.nav.offsetWidth
      // 获取tab导航栏的可见宽度（不包括overflow部分）
      const containerWidth = this.$refs.navScroll.offsetWidth
      // 当前navStyle元素的移动距离
      const currentOffset = this.getCurrentScrollOffset()
      let newOffset = null
      // 实际内容的宽度 - 当前navStyle元素的移动距离 > 当前页面宽度 * 2
      if (navWidth - currentOffset >= containerWidth * 2) {
        // 点击一次，移动一个containerWidth的距离
        newOffset = currentOffset + containerWidth
      } else {
        newOffset = navWidth - containerWidth
      }
      this.navStyle.transform = `translateX(-${newOffset}px)`
    },
    // 关闭标签
    closeTab(id) {
      const index = this.tabList.findIndex(item => item.id === id)
      this.closedTabIndex = index
      this.tabList.splice(index, 1)
    },
    handleUpDown() {
      if (this.upDownIcon === 'up') {
        const mainHeight = this.appMainHeight - 300
        this.$emit('resetAppMainHeight', mainHeight)
        this.upDownIcon = 'down'
      } else {
        this.$emit('resetAppMainHeight', -1)
        this.upDownIcon = 'up'
      }
    },
    // 鼠标调整主窗口与底部工具栏的高度
    handleMouseDown(event) {
      if (this.isShow) {
        // 禁止用户选用网页中的文字
        document.onselectstart = () => false
        // 禁止用户拖动元素
        document.ondragstart = () => false
        // 鼠标的初始Y值
        this.mousePosition.startY = event.clientY
        // mouseDown时获取一次.app-main元素的高度，供mouseMove事件使用
        if (this.isGetAppMainHeight) {
          this.mouseDownAppMainHeight = this.appMainHeight
          this.isGetAppMainHeight = false
        }
        // 如果导航栏在底部，resizeBar被点击之后，上升一个初始高度(考虑add点击之后的下拉菜单展示问题)
        if (this.upDownIcon === 'up') {
          const mainHeight = this.appMainHeight - 100
          this.$emit('resetAppMainHeight', mainHeight)
          this.upDownIcon = 'down'
        }
        // 绑定鼠标移动事件
        document.addEventListener('mousemove', this.handleMouseMove)
        // 绑定鼠标放开事件
        document.addEventListener('mouseup', this.handleMouseUp)
      }
    },
    handleMouseMove(event) {
      // 当前鼠标的Y值
      this.mousePosition.endY = event.clientY
      // 鼠标移动的距离
      const distance = this.mousePosition.endY - this.mousePosition.startY
      let mainHeight = this.mouseDownAppMainHeight + distance
      if (mainHeight < 0) {
        mainHeight = 0
      }
      this.$emit('resetAppMainHeight', mainHeight)
      // 判断tab-content元素的高度，改变up-down图标
      const tc = this.$refs['tab-content']
      if (tc.offsetHeight === 0) {
        this.upDownIcon = 'up'
      } else {
        this.upDownIcon = 'down'
      }
    },
    handleMouseUp() {
      // 移除鼠标移动事件
      document.removeEventListener('mousemove', this.handleMouseMove)
      // 移除鼠标放开事件
      document.removeEventListener('mouseup', this.handleMouseUp)
      // 允许用户选择网页中的文字
      document.onselectstart = null
      // 允许用户拖动元素
      document.ondragstart = null
      // 下次鼠标按下时，允许获取一次app-main高度
      this.isGetAppMainHeight = true
    },
    handleMouseOver() {
      if (this.isShow) {
        const rb = this.$refs.resizeBar
        rb.style.backgroundColor = '#2e95d5'
        rb.style.cursor = 'ns-resize'
      }
    },
    handleMouseOut() {
      const rb = this.$refs.resizeBar
      rb.style.backgroundColor = ''
      rb.style.cursor = ''
    },
    handleFullScreen() {
      if (this.fullScreenIcon === 'full') {
        // 全屏之前记录app-main元素高度
        this.tmpHeight = this.appMainHeight
        // 改变tabs的css样式，实现全屏
        this.$refs.tabs.style.top = '0'
        this.$refs.tabs.style.left = '0'
        this.$refs.tabs.style.position = 'absolute'
        this.$refs.tabs.style.height = 'calc(100vh)'
        // 全屏时改变相应的图标
        this.fullScreenIcon = 'exitFull'
        this.upDownIcon = 'down'
      } else {
        // 退出全屏时，还原tabs的css样式
        this.$refs.tabs.style.top = ''
        this.$refs.tabs.style.left = ''
        this.$refs.tabs.style.position = ''
        this.$refs.tabs.style.height = ''
        // 还原app-main高度
        this.$emit('resetAppMainHeight', this.tmpHeight)
        // 同时计算tab的高度
        this.$refs.tabs.style.height = (document.body.clientHeight - this.appMainHeight - 115) + 'px'
        // 改变相应图标
        this.fullScreenIcon = 'full'
      }
    },
    // add按钮被点击
    handleDropMenu() {
      // 是否展示下拉菜单
      this.showDropMenu = !this.showDropMenu
      // 根据add位置及底部导航栏位置判断下拉菜单如何展示
      if (this.$refs.resizeBar.offsetWidth - this.$refs.add.offsetLeft >= 160) {
        if (this.upDownIcon === 'up') {
          this.$refs['drop-menu'].style.left = '0'
          this.$refs['drop-menu'].style.top = ''
          this.$refs['drop-menu'].style.right = ''
          this.$refs['drop-menu'].style.bottom = '30px'
        } else {
          this.$refs['drop-menu'].style.left = '0'
          this.$refs['drop-menu'].style.top = '30px'
          this.$refs['drop-menu'].style.right = ''
          this.$refs['drop-menu'].style.bottom = ''
        }
      } else {
        if (this.upDownIcon === 'up') {
          this.$refs['drop-menu'].style.left = ''
          this.$refs['drop-menu'].style.top = ''
          this.$refs['drop-menu'].style.right = '0'
          this.$refs['drop-menu'].style.bottom = '30px'
        } else {
          this.$refs['drop-menu'].style.left = ''
          this.$refs['drop-menu'].style.top = '30px'
          this.$refs['drop-menu'].style.right = '0'
          this.$refs['drop-menu'].style.bottom = ''
        }
      }
    },
    // add按钮新建资源菜单被点击
    createResource() {
      // 点击之后关闭菜单
      this.showDropMenu = false
      // 向tabList添加create项
      this.$store.commit(
        'tabsList/ADDTAB',
        {
          type: 'create'
        })
    },
    // add按钮新建终端菜单被点击
    createTerminal() {
      // 点击之后关闭菜单
      this.showDropMenu = false
    },
    // 点击其他位置，关闭add按钮的下拉菜单
    clickOutOfAdd(e) {
      const addRef = this.$refs.add
      if (!addRef.contains(e.target) && this.showDropMenu) {
        this.showDropMenu = false
      }
    }
  }
}

</script>

<style scoped>
.tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative; /*设置position为非static，避免z-index异常*/
  z-index: 1;
}

.resizeBar {
  background-color: #5d5e69;
  height: 4px;
  /* x-resize 表示移动的方向，鼠标图标会自动改变 */
}

.tabs-header {
  background-color: #5d5e69;
  height: 32px;
  display: flex;
  padding-bottom: 4px;
}

.tab-content {
  background-color: #ffffff;
  flex: 1;
  height: 0px;
}

.tabs-nav-wrap {
  overflow: hidden;
}

.add, .full, .up-down {
  margin: 4px 10px;
  width: 20px;
  height: 20px;
  padding: 2px;
}

.svg-icon.left-icon, .svg-icon.right-icon, .svg-icon.add-icon, .svg-icon.full-icon, .svg-icon.up-down-icon, .svg-icon.terminal-icon, .svg-icon.edit-icon {
  fill: #BDBDBD;
  cursor: pointer;
}

.tabs-nav-previous:hover, .tabs-nav-next:hover, .add:hover, .full:hover, .up-down:hover {
  background-color: #747479;
}

/*hover控制子元素*/
.tabs-nav-previous:hover .svg-icon.left-icon,
.tabs-nav-next:hover .svg-icon.right-icon,
.add:hover .svg-icon.add-icon,
.full:hover .svg-icon.full-icon,
.up-down:hover .svg-icon.up-down-icon {
  fill: white;
}

/*如果需要左右滚动，则需要添加箭头图标，设置左右padding值，为箭头图标腾出显示空间*/
.tabs-nav-scrollable {
  padding: 0 40px
}

/*隐藏左右箭头按钮*/
.tabs-nav-scroll-disabled {
  display: none;
}

.tabs-nav-previous, .tabs-nav-next {
  position: absolute;
  text-align: center;
  width: 20px;
  height: 20px;
  line-height: 22px;
  cursor: pointer;
  margin: 4px 10px;
}

.tabs-nav-previous {
  left: 0;
}

.tabs-nav-next {
  right: 0;
}

.tabs-nav-scroll {
  overflow: hidden;
  white-space: nowrap;
}

.tabs-nav {
  position: relative;
  float: left;
  transition: transform 0.5s ease-in-out;
}

.tabs-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: #2d8cf0;
  height: 4px;
  transition: transform 300ms ease-in-out;
}

.tabs-tab {
  display: inline-block;
  margin-right: 16px;
  padding: 5px 16px;
  font-size: 14px;
  color: #BDBDBD;
  cursor: pointer;
}

.tab-title {
  display: inline-block;
  /*实现内容过长的省略效果*/
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.el-icon-close {
  color: #BDBDBD;
  width: 14px;
  height: 14px;
}

.el-icon-close:hover {
  background-color: #747479;
  color: white;
  border-radius: 50%;
  font-weight: 900;
}

/*清除浮动*/
.clearfix::after {
  /*伪元素必须写content，使用content才会有效果*/
  content: "";
  /*伪元素默认时行内块元素，要设置为块元素才有效果*/
  display: block;
  clear: both;
  visibility: hidden;
}

.add {
  position: relative;
}

.drop-menu {
  min-width: 160px;
  height: 50px;
  background-color: #5d5e69;
  padding: 5px 10px;
  list-style-type: none;
  border: 1px solid #BDBDBD;
  border-radius: 2px;
  position: absolute;
  margin: 0;
}

.drop-menu li {
  color: #BDBDBD;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
}

.drop-menu li:hover {
  background-color: #2e95d5;
  font-weight: 500;
  color: white;
}

.drop-menu li:hover .svg-icon {
  fill: white;
}

</style>
