<template>
  <div id="podlog">
    <div id="podlog_header">
      <el-form :inline="true" :rules="rules" :model="logInfo" class="demo-form-inline">
        <el-form-item label="容器">
          <el-select v-model="container" placeholder="请选择容器">
            <el-option v-for="(item, key) in containersName" :key="key" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="末尾行数" prop="tailLines">
          <el-input v-model.trim.number="logInfo.tailLines" placeholder="请输入日志行数" />
        </el-form-item>
        <el-form-item>
          <el-button v-model="logInfo.followText" type="primary" @click="changeLogFollow">
            {{ logInfo.followText }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-model="connText" type="primary" @click="changeWebsocketConn">
            {{ connText }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--可以监听scroll事件，获取scrollTop的值，可以将滚动条初始位置设置在div底部-->
    <div id="podlog_main" @scroll="handleScroll">
      <div v-for="(msg, index) in followMessageList" :key="index" class="podlog_content">
        <span>{{ msg }}</span>
      </div>
    </div>
    <!--
    size-change: pageSize改变时会触发
    current-change: currentPage改变时会触发
    current-page:	当前页数，支持 .sync 修饰符
    page-sizes: 每页显示个数选择器的选项设置,num[]
    page-size: 每页显示条目个数，支持 .sync 修饰符
    total: 总条目数
    -->
    <el-pagination
      v-if="!logInfo.isFollow"
      class="podlog_page"
      :current-page="logInfo.currentPage"
      :page-sizes="pageSizes"
      :page-size="logInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalLines"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { isJSON } from '@/utils/tools'

export default {
  name: 'PodLog',
  props: ['namespace', 'pod', 'containersName'],
  data() {
    return {
      container: '',
      followMessageList: [],
      ws: null,
      lockReconnect: false, // 重连标志,false为允许重连
      timeout: 30 * 1000, // 30秒一次心跳
      heartBeatTimeout: null, // 延时发送心跳ping
      serverResponseTimeout: null, // 当30秒内服务器未响应时，延时关闭websocket连接。
      reconnTimeout: null, // 连接被关闭时，延时重连websocket
      // 表单校验
      rules: {
        tailLines: [
          { type: 'number', min: 0, message: '行数必须是大于等于0的数字', trigger: 'blur' }
        ]
      },
      // 日志分页
      // pageSizes: [100, 200, 400, 600, 800, 1000], // 可选单页日志行条目
      pageSizes: [5, 10, 20], // 可选单页日志行条目
      totalLines: 0, // 总行数
      // 日志跟踪
      logInfo: {
        pageSize: 5, // 默认单页日志行数
        currentPage: 1, // 默认当前页码
        tailLines: 100, // 查看日志最后n行
        isFollow: false, // 等于kubectl log -f
        followText: '日志刷新' // 页面按钮
      },
      // 连接websocket
      isConn: false,
      connText: '获取日志'

    }
  },
  computed: {
    url() {
      return `${process.env.VUE_APP_WEBSOCKET_API}/workload/log?namespace=${this.namespace}&pod=${this.pod}&container=${this.container}&isFollow=${this.logInfo.isFollow}&tailLines=${this.logInfo.tailLines}&pageSize=${this.logInfo.pageSize}&currentPage=${this.logInfo.currentPage}`
    }
  },
  watch: {
    logInfo: {
      // immediate: true, // 在before create和created之间加载
      deep: true,
      handler() {
        var that = this
        console.log('watch监测到数据变化')
        if (that.isConn) {
          that.lockReconnect = false
          that.closeWebsocket()
        }
        // that.ws.send(JSON.stringify(that.logQuery))
      }
    }
  },
  beforeDestroy() {
    var that = this
    that.cleanDataBeforeCloseConn()
    // 获取不到reason???
    that.ws && that.ws.close(4000, 'close websocket before destroy PodLog component')
  },
  methods: {
    // 初始化socket
    initWebsocket: function(url) {
      // 实例化socket
      this.ws = new WebSocket(url)
      // 监听socket连接
      this.ws.onopen = this.openWebsocket
      // 监听socket错误信息
      this.ws.onerror = this.errorWebsocket
      // // 使用this.socket.close = this.closeWebsocket会报错，Error in beforeDestroy hook: "RangeError: Maximum call stack size exceeded"
      this.ws.onclose = this.closeWebsocket
      // 监听socket消息
      this.ws.onmessage = this.getMessage
    },
    // websocket重新连接
    reconnect() {
      console.log('websocket reconnect')
      var that = this
      if (that.lockReconnect) {
        return
      }
      // 重置部分变量
      this.followMessageList = []

      // 重置延时
      that.reconnTimeout && clearTimeout(that.reconnTimeout)
      that.reconnTimeout = setTimeout(function() {
        // 新连接
        that.initWebsocket(that.url)
      }, 2000)
    },
    resetHeartbeat() {
      // 重置心跳
      var that = this
      // 清除时间
      clearTimeout(that.heartBeatTimeout)
      clearTimeout(that.serverResponseTimeout)
      // 重启心跳
      that.startHeartbeat()
    },
    startHeartbeat() {
      // 开启心跳
      var self = this
      self.heartBeatTimeout && clearTimeout(self.heartBeatTimeout)
      self.serverResponseTimeout && clearTimeout(self.serverResponseTimeout)
      self.heartBeatTimeout = setTimeout(function() {
        if (self.ws.readyState === 1) {
          // 连接正常
          self.ws.send(JSON.stringify({ heartbeat: 'ping' }))
        }
        self.serverResponseTimeout = setTimeout(function() {
          // 30秒关闭连接？？？？
          // 关闭socket连接后，允许重连
          self.lockReconnect = false
          self.ws.close()
        }, 2000)
      }, self.timeout)
    },
    openWebsocket() {
      // 开启心跳
      this.startHeartbeat()
      // // 初始化ws之后，发送一个默认查询数据
      console.log('执行 open websocket')
      // 禁止重连
      this.lockReconnect = true
    },
    closeWebsocket() {
      this.reconnect()
    },
    errorWebsocket() {
      // 允许重连
      this.lockReconnect = false
      // 重连
      this.reconnect()
    },
    getMessage(msg) {
      if (msg.data === '{"heartbeat":"pong"}') {
        console.log(msg.data)
        this.resetHeartbeat()
      } else {
        // this.msgList.push(msg.data)
        if (this.logInfo.isFollow) {
          this.followMessageList.push(msg.data)
          this.totalLines = this.followMessageList.length
        } else {
          if (isJSON(msg.data)) {
            var obj = JSON.parse(msg.data)
            this.totalLines = obj.totalLines
          } else {
            this.followMessageList.push(msg.data)
          }
        }
      }
    },
    handleSizeChange(val) {
      this.logInfo.pageSize = val
    },
    handleCurrentChange(val) {
      this.logInfo.currentPage = val
    },
    handleScroll(event) {
      // console.log('scrollTop: ', event.srcElement.scrollTop)
      // console.log('scrollHeight: ', event.srcElement.scrollHeight)
      // console.log('podlog offsetHeight: ', event.srcElement.offsetHeight)
    },
    changeLogFollow() {
      this.logInfo.isFollow = !this.logInfo.isFollow
      if (this.logInfo.isFollow) {
        this.logInfo.followText = '停止刷新'
        this.logInfo.currentPage = 1
      } else {
        this.logInfo.followText = '日志刷新'
      }
    },
    changeWebsocketConn() {
      var that = this
      that.isConn = !that.isConn
      if (that.isConn) {
        that.connText = '停止获取'
        // 初始化websocket
        that.initWebsocket(that.url)
      } else {
        that.connText = '获取日志'
        that.cleanDataBeforeCloseConn()
        // 获取不到reason
        that.ws && that.ws.close(4001, 'close websocket when the conn button was clicked')
      }
    },
    cleanDataBeforeCloseConn() {
      var that = this
      // 清理定时器
      clearTimeout(that.heartBeatTimeout)
      clearTimeout(that.serverResponseTimeout)
      clearTimeout(that.reconnTimeout)
      // 清理日志列表
      that.followMessageList = []
      // 关闭socket连接后，禁止重连
      that.lockReconnect = true
    }
  }
}
</script>

<style scoped>
#podlog {
  margin-left: 15px;
  margin-right: 15px;
  width: 1110px;
  height: 680px;
}

#podlog_header {
  /*display: flex;*/
  /*flex-direction: row;*/
  /*flex-wrap: nowrap;*/
  /*justify-content: center;*/
  /*line-height: 50px;*/
  height: 60px;
}

#podlog_main {
  background-color: #2b2f3a;
  overflow: scroll;
  font-family: 微软雅黑, sans-serif;
  font-size: 14px;
  color: white;
  scroll-behavior: auto;
  width: 1110px;
  height: 560px;
}

span {
  padding: 5px;
}

.podlog_page {
  margin-top: 20px;
  text-align: center;
}
</style>
