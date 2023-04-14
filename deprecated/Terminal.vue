<template>
  <div id="podterminal">
    <div id="podterminal_header">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="容器">
          <el-select v-model="container" placeholder="请选择容器">
            <el-option v-for="(item, key) in containersName" :key="key" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="shell">
          <el-select v-model="shell" placeholder="请选择shell">
            <el-option label="bash" value="bash" />
            <el-option label="sh" value="sh" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-model="connText" type="primary" @click="changeWebsocketConn">
            {{ connText }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="podterminal_main" ref="terminal" />
  </div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

export default {
  name: 'Terminal',
  // eslint-disable-next-line vue/require-prop-types
  props: ['namespace', 'pod', 'containersName'],
  data() {
    return {
      term: null, // terminal实例
      ws: null, // websocket实例
      shell: null, // 待连接容器的shell
      container: '', // 容器名称
      lockReconnect: false, // 重连标志,false为允许重连
      timeout: 30 * 1000, // 30秒一次心跳
      heartBeatTimeout: null, // 延时发送心跳ping
      serverResponseTimeout: null, // 当30秒内服务器未响应时，延时关闭websocket连接。
      reconnTimeout: null, // 连接被关闭时，延时重连websocket
      isConn: false, // websocket连接标志
      connText: '连接', // 连接按钮的text
      defaultTheme: { // terminal主题颜色
        foreground: '#ffffff',
        background: '#1b212f',
        cursor: '#ffffff',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        brightBlack: '#808080',
        red: '#ce2f2b',
        brightRed: '#f44a47',
        green: '#00b976',
        brightGreen: '#05d289',
        yellow: '#e0d500',
        brightYellow: '#f4f628',
        magenta: '#bd37bc',
        brightMagenta: '#d86cd8',
        blue: '#1d6fca',
        brightBlue: '#358bed',
        cyan: '#00a8cf',
        brightCyan: '#19b8dd',
        white: '#e5e5e5',
        brightWhite: '#ffffff'
      }
    }
  },
  computed: {
    rows() {
      return window.outerHeight / 16 - 13
    },
    cols() {
      return document.body.offsetWidth / 10
    },
    url() {
      // return `${process.env.VUE_APP_WEBSOCKET_API}/workload/exec?namespace=${this.namespace}&pod=${this.pod}&container=${this.container}`
      return `${process.env.VUE_APP_WEBSOCKET_API}/workload/exec?namespace=${this.namespace}&pod=${this.pod}&container=${this.container}&shell=${this.shell}`
    }
  },
  beforeDestroy() {
    var that = this
    that.cleanDataBeforeCloseConn()
    // 获取不到reason???
    that.ws && that.ws.close(4000, 'close websocket before destroy PodLog component')
    that.term && that.term.dispose()
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

      // 重置延时
      that.reconnTimeout && clearTimeout(that.reconnTimeout)
      that.reconnTimeout = setTimeout(function() {
        // 新连接
        that.initWebsocket(that.url)
      }, 2000)
    },
    // 重置心跳
    resetHeartbeat() {
      var that = this
      // 清除延时
      that.heartBeatTimeout && clearTimeout(that.heartBeatTimeout)
      that.serverResponseTimeout && clearTimeout(that.serverResponseTimeout)
      // 重启心跳
      that.startHeartbeat()
    },
    // 开启心跳
    startHeartbeat() {
      var that = this
      that.heartBeatTimeout = setTimeout(function() {
        if (that.ws.readyState === 1) {
          // 连接正常
          that.ws.send(JSON.stringify({ heartbeat: 'ping' }))
        }
        that.serverResponseTimeout = setTimeout(function() {
          // 30秒关闭连接？？？？
          // 关闭socket连接后，允许重连
          that.lockReconnect = false
          that.ws.close()
        }, 2000)
      }, that.timeout)
    },
    // websocket的onopen事件触发
    openWebsocket() {
      // 开启心跳
      this.startHeartbeat()
      console.log('执行 open websocket')
      // 禁止重连
      this.lockReconnect = true
    },
    // websocket的onclose事件触发
    closeWebsocket() {
      this.reconnect()
    },
    // websocket的onerror事件触发
    errorWebsocket() {
      // 允许重连
      this.lockReconnect = false
      // 重连
      this.reconnect()
    },
    // websocket的onmessage事件触发
    getMessage(msg) {
      if (msg.data === '{"heartbeat":"pong"}') {
        // 收到心跳监测回复后重置心跳timeout
        this.resetHeartbeat()
      } else {
        // websocket接收到数据并打印到终端
        this.term.write(msg.data.toString())
      }
    },
    cleanDataBeforeCloseConn() {
      var that = this
      // 清理定时器
      clearTimeout(that.heartBeatTimeout)
      clearTimeout(that.serverResponseTimeout)
      clearTimeout(that.reconnTimeout)
      // 关闭socket连接后，禁止重连
      that.lockReconnect = true
    },

    // 初始化终端
    initTerminal() {
      const that = this
      that.term = new Terminal({
        // rows: parseInt(that.rows),
        // cols: parseInt(that.cols),
        rows: 20,
        cols: 100,
        rendererType: 'canvas', // 渲染类型
        fontSize: 16, // 字体大小
        cursorBlink: true, // 光标闪烁
        cursorStyle: 'underline', // 光标样式
        bellStyle: 'sound',
        theme: that.defaultTheme // 主题颜色搭配
      })
      const fitAddon = new FitAddon()
      that.term.loadAddon(fitAddon)
    },
    // 设置终端尺寸？？？？？？？？？
    bindTerminalResize() {
      var that = this
      const onTermResize = size => {
        that.ws.send(
          JSON.stringify({
            type: 'resize',
            rows: size.rows,
            cols: size.cols
          })
        )
      }
      // register resize event.
      that.term.onData(onTermResize)
      // unregister resize event when WebSocket closed.
      that.ws.addEventListener('close', function() {
        that.ws.removeEventListener(onTermResize)
      })
    },
    // 终端接收用户输入并发送到websocket服务端
    terminalInput(data) {
      this.ws.send(
        JSON.stringify({
          type: 'input',
          input: data // encode data as base64 format
        })
      )
    },
    // 点击“连接”按钮时触发
    changeWebsocketConn() {
      var that = this
      that.isConn = !that.isConn
      if (that.isConn) {
        that.connText = '关闭'
        that.initWebsocket(that.url)
        // 初始化terminal不能写到mounted内
        that.initTerminal()
        that.term.open(that.$refs['terminal'])
        // 终端发送数据到websocket服务端(服务端返回数据由websocket的onmessage事件完成)
        that.term.onData(that.terminalInput)
      } else {
        that.connText = '连接'
        that.cleanDataBeforeCloseConn()
        // 获取不到reason
        that.ws && that.ws.close(4001, 'close websocket when the conn button was clicked')
        that.term && that.term.dispose()
      }
    }
  }
}
</script>

<style scoped>
#podterminal {
  width: 1110px;
  height: 680px;
}

#podterminal_header {
  height: 60px;
}

#podterminal_main {
  width: 1110px;
  height: 560px;
}
</style>
