<template>
  <div class="content-main">
    <div class="terminal-content-header">
      <div>Namespace:<span>{{ currentTab.namespace }}</span></div>
      <div>PodName:<span>{{ currentTab.resourceName }}</span></div>
      <div>
        Container:
        <el-select v-model="selectedContainer" placeholder="Select Template...">
          <el-option
            v-for="(item, index) in currentTab.containers"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <div ref="xterm" class="xterm" />
  </div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { debounce } from 'lodash'
import SockJS from 'sockjs-client'
import { getGenerateSessionID } from '@/api/kubernetes/workload/pod'

export default {
  name: 'PodTerminal',
  props: {
    currentTab: {
      type: Object,
      default: () => {}
    },
    tabsHeight: {
      type: String
    }
  },
  data() {
    return {
      // xterm实例
      term: undefined,
      // term防抖函数
      debouncedFit: undefined,
      // websocket实例
      ws: undefined,
      // websocket正在连接
      wsConnecting: false,
      // websocket已连接
      wsConnected: false,
      // websocket连接关闭
      wsConnectionClosed: false,
      // terminalSessionID
      sessionID: '',
      // 被选中的容器
      selectedContainer: this.currentTab.containers[0]
      // 被选中的shell
      // selectedShell: this.currentTab.shell[0]
    }
  },
  watch: {
    selectedContainer: {
      handler() {
        this.disconnect()
        this.initTerm()
        this.setConnection()
      }
    },
    tabsHeight: {
      handler() {
        this.debouncedFit()
      }
    }
  },
  beforeDestroy() {
    this.disconnect()
  },
  mounted() {
    this.initTerm()
    this.setConnection()

    // Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
    // 不生效，不知道放哪里
    // const canvas = this.$refs.xterm.getElementsByTagName('canvas')
    // for (const item of canvas) {
    //   item.getContext('2d', { willReadFrequently: true })
    // }
  },
  methods: {
    // 1. 初始化xterm
    initTerm() {
      // 清理历史xterm DOM，清理监听
      if (this.term) {
        this.term.dispose()
      }

      // 新建xterm
      this.term = new Terminal({
        fontSize: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
        bellStyle: 'sound',
        cursorBlink: true
      })

      this.term.open(this.$refs.xterm)
      // resize防抖，重要！
      const fitAddon = new FitAddon()
      this.term.loadAddon(fitAddon)
      this.debouncedFit = debounce(() => {
        fitAddon.fit()
      }, 100)
      this.debouncedFit()

      // 添加resize监听事件,一定是window.addEventListener！！！！，能直接向this.term.onResize返回cols和rows，不用计算
      window.addEventListener('resize', () => this.debouncedFit())

      // 发送数据
      this.term.onData(this.onTerminalSendString)
      // 重置窗口大小
      this.term.onResize(this.onTerminalResize)
      // 基本不需要onkey，client-go会自动返回每行的起始符号以及交互结果，onkey应该可以设置一些快捷键，如ctrl+c等，待研究
    },
    // 终端发送消息到后端，value的值就是键盘输入的字符，通过console.log可以打印，感觉value就是键盘输入事件？
    onTerminalSendString(value) {
      if (this.wsConnected) {
        this.ws.send(JSON.stringify({
          Op: 'stdin',
          Data: value,
          Cols: this.term.cols, // 只读
          Rows: this.term.rows // 只读
        }))
      }
    },
    // 将最新的终端窗口大小发送给后端
    onTerminalResize(event) {
      if (this.wsConnected && event) {
        this.ws.send(JSON.stringify({
          Op: 'resize',
          Cols: event.cols,
          Rows: event.rows
        }))
      }
    },
    // 2. 建立websocket连接(就是初始化websocket）
    async setConnection() {
      // 判断namespace pod_name container_name shell 是否为空，如果为空，退出函数
      // if (!(this.currentTab.namespace && this.currentTab.resourceName && this.selectedContainer && this.selectedShell && !this.wsConnecting)) {
      if (!(this.currentTab.namespace && this.currentTab.resourceName && this.selectedContainer && !this.wsConnecting)) {
        return
      }

      this.wsConnecting = true
      this.wsConnected = false
      this.wsConnectionClosed = false

      await new Promise(() => {
        // getGenerateSessionID(this.currentTab.namespace, this.currentTab.resourceName, this.selectedContainer, this.selectedShell).then(res => {
        getGenerateSessionID(this.currentTab.namespace, this.currentTab.resourceName, this.selectedContainer).then(res => {
          if (res.code === 0) {
            this.sessionID = res.sessionID
            this.ws = new SockJS(`${process.env.VUE_APP_BASE_API}/api/sockjs?${this.sessionID}`)
            this.ws.onopen = this.onConnectionOpen
            this.ws.onmessage = this.onConnectionMessage
            this.ws.onclose = this.onConnectionClose
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    onConnectionOpen() {
      const startData = {
        Op: 'bind',
        SessionID: this.sessionID
      }
      // 向后端发送bind操作，后端通过sessionID绑定对应的terminalSession实例
      this.ws.send(JSON.stringify(startData))
      // 设置连接状态标志
      this.wsConnecting = false
      this.wsConnected = true
      this.wsConnectionClosed = false

      // 向后端确认xterm终端的size
      this.onTerminalResize()

      // Focus on connection
      this.term.focus()
    },
    onConnectionMessage(event) {
      // {type: 'message', bubbles: false, cancelable: false, timeStamp: 1676216281690, data: '{"Op":"stdout","Data":"c","SessionID":"","Rows":0,"Cols":0}'}
      // ！！！！！！！！！ this.term.write一定要写，不然终端无法识别键盘输入，也无法打印后端返回的结果
      const msg = JSON.parse(event.data)
      this.term.write(msg.Data.toString())
    },
    onConnectionClose() {
      if (!this.wsConnected) {
        return
      }
      // 关闭websocket
      this.ws.close()
      this.wsConnecting = false
      this.wsConnected = false
      this.wsConnectionClosed = true
    },
    disconnect() {
      // 关闭websocket连接
      if (this.ws) {
        this.ws.close()
      }
      // 清理历史xterm DOM，清理监听
      if (this.term) {
        this.term.dispose()
      }

      // 移除resize监听
      this.$refs.xterm.removeEventListener('resize', () => this.debouncedFit())
    }
  }
}
</script>

<style scoped>
.content-main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.terminal-content-header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #2e95d5;
  display: flex;
  flex-direction: row;
}

.terminal-content-header div {
  margin: 0 2px;
}

.terminal-content-header div span {
  background-color: #a7a7ab;
}

.xterm {
  flex: 1;
  overflow: auto;
}

</style>
