<template>
  <div class="content-main">
    <div class="log-content-header">
      <div>Namespace:<span>{{ currentTab.namespace }}</span></div>
      <div>Ower:<span>resourceType resourceName</span></div>
      <div>Pod:<span>{{ currentTab.resourceName }}</span></div>
      <div>
        Container:
        <el-select v-model="selectedContainer">
          <el-option
            v-for="(item, index) in currentTab.containers"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <codemirror
      ref="logContent"
      class="log-content"
      :value="formatLog"
      :options="cmOptions"
    />
    <div class="log-content-buttom">
      <!--<div><span>Logs from <span :title="logFromDate">{{ formatDate(logFromDate) }}</span> To <span :title="logToDate">{{ formatDate(logToDate) }}</span> UTC</span></div>-->
      <div><span>Logs from <ToolTips :value="formatDate(logFromDate)" :tip-value="logFromDate" /> To <ToolTips :value="formatDate(logToDate)" :tip-value="logToDate" /> UTC</span></div>
      <div class="pages">
        <svg-icon icon-class="beginning" @click="loadOldest" />
        <svg-icon icon-class="previous" @click="loadOlder" />
        <svg-icon icon-class="next" @click="loadNewer" />
        <svg-icon icon-class="end" @click="loadNewest" />
      </div>
      <div><input class="ts" type="checkbox" @click="checkbox"><span>show timestamps</span></div>
      <div><input class="ptc" type="checkbox" @click="checkbox"><span>show previous terminated container</span></div>
      <div><input class="follow" type="checkbox" @click="checkbox"><span>follow</span></div>
      <div><svg-icon icon-class="download" @click="getContainerLogFile" /></div>
    </div>
  </div>
</template>

<script>
// codemirror
import 'codemirror/lib/codemirror.css'
import codemirror from 'vue-codemirror/src/codemirror'
// theme
import 'codemirror/theme/lesser-dark.css'
// search
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
// scroll
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'

import axios from 'axios'
import { getToken } from '@/utils/auth'

// component
import ToolTips from '@/components/ToolTips'

export default {
  name: 'PodLog',
  components: {
    codemirror,
    ToolTips
  },
  props: {
    currentTab: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      // 被选择的pod
      selectedPod: undefined,
      // 被选择的container
      selectedContainer: this.currentTab.containers[0],
      // 服务端响应的log
      responseLog: '',
      // 格式化log（是否添加timestamp）
      formatLog: '',
      // codemirror options
      cmOptions: {
        lineNumbers: true,
        lineWrapping: false,
        theme: 'lesser-dark',
        scrollbarStyle: 'simple',
        viewportMargin: Infinity,
        readOnly: true
      },
      // 显示时间戳
      showTimestamp: false,
      // 日志起始时间
      logFromDate: '',
      // 日志截止时间
      logToDate: '',
      // 显示已经terminated的容器的日志
      showPreviousTerminatedContainer: false,
      // 是否follow日志，相当于tail -f
      follow: false,
      // currentSelection，即当前日志的过滤条件，为下次日志查询做参考
      currentSelection: {},
      // 当前日志的信息
      currentLogInfo: {},
      // 展示日志行数
      logsPerView: 100,
      // 最大日志行数
      maxLogSize: 2e9,
      // 从日志起始位置开始加载文件，日过日志文件太大，可能会有问题
      beginningOfLogFile: 'beginning',
      // 从日志末尾位置开始加载文件，日过日志文件太大，可能会有问题
      endOfLogFile: 'end',
      // 起始时间
      oldestTimestamp: 'oldest',
      // 最新时间
      newestTimestamp: 'newest'
    }
  },
  watch: {
    showTimestamp: {
      handler(value) {
        this.handleLogFormat(this.responseLog)
      }
    }
  },
  mounted() {
    this.loadNewest()
  },
  methods: {
    // 改变checkbox的值
    checkbox(event) {
      if (event.target.className === 'ts') {
        this.showTimestamp = event.target.checked
      }
      if (event.target.className === 'ptc') {
        this.showPreviousTerminatedContainer = event.target.checked
      }
      if (event.target.className === 'follow') {
        this.follow = event.target.checked
      }
    },
    // 格式化日志（timestamp）
    handleLogFormat(logs) {
      this.formatLog = ''
      if (this.showTimestamp) {
        logs.forEach(item => {
          this.formatLog += item.timestamp + ' ' + item.content + '\n'
        })
      } else {
        logs.forEach(item => {
          this.formatLog += item.content + '\n'
        })
      }
    },
    // 获取容器日志
    getContainerLog(
      logFilePosition,
      referenceTimestamp,
      referenceLineNum,
      offsetFrom,
      offsetTo,
      previous,
      follow
    ) {
      /* 后端返回的数据格式
      {
        "code": 0,
        "data": {
            "info": {
              "podName": "nginx-12415315654363546",
              "containerName": "nginx",
              "initContainerName": "",
              "fromDate": "2023-03-05T07:19:51.097981367Z",
              "toDate": "2023-03-05T07:19:51.612152688Z",
              "truncated": false
            },
            "selection": {
              "referencePoint": {
                "timestamp": "2023-03-05T07:19:42.660248214Z",
                "lineNum": -1
              },
              "offsetFrom": 13,
              "offsetTo": 15,
              "logFilePosition": "beginning"
            },
            "logs": [
              {
                "timestamp": "2023-03-05T07:19:51.097981367Z",
                "content": "20.20.219.64 - - [05/Mar/2023:07:19:51 +0000] \"GET / HTTP/1.1\" 200 612 \"-\" \"curl/7.29.0\" \"-\""
              },
              {
                "timestamp": "2023-03-05T07:19:51.612152688Z",
                "content": "20.20.219.64 - - [05/Mar/2023:07:19:51 +0000] \"GET / HTTP/1.1\" 200 612 \"-\" \"curl/7.29.0\" \"-\""
              }
            ]
        },
        "msg": "ok"
      }
      */

      // 请求前清理本地日志数据
      this.responseLog = ''

      // 请求日志数据
      axios.get(`${process.env.VUE_APP_BASE_API}/workload/log/${this.currentTab.namespace}/${this.currentTab.resourceName}/${this.selectedContainer}?logFilePosition=${logFilePosition}&referenceTimestamp=${referenceTimestamp}&referenceLineNum=${referenceLineNum}&offsetFrom=${offsetFrom}&offsetTo=${offsetTo}&previous=${previous}&follow=${follow}`, { headers: {
        token: getToken()
      }})
        .then(res => {
          if (res.data.code === 0) {
            // 获取selection
            this.currentSelection = res.data.data.selection
            // 获取info
            this.currentLogInfo = res.data.data.info
            // 获取日志起始时间
            this.logFromDate = this.currentLogInfo['fromDate']
            // 获取日志截止时间
            this.logToDate = this.currentLogInfo['toDate']
            // 输出日志
            if (res.data.data.logs.length !== 0) {
              this.responseLog = res.data.data.logs
              this.handleLogFormat(this.responseLog)
            }
          }
        }).catch(err => {
          console.log(err)
        })
    },
    // 获取容器文件
    getContainerLogFile(previous) {
      // 不能设置为true，不知道它表示什么，表示故障之前的容器？？？？
      axios.get(`${process.env.VUE_APP_BASE_API}/workload/logfile/${this.currentTab.namespace}/${this.currentTab.resourceName}/${this.selectedContainer}?previous=${previous}`, { headers: {
        token: getToken()
      }}).then(res => {
        // Blob是一个不可变的、原始数据的类文件对象，它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作。
        const blob = new Blob([res.data], {
          // pptx的MIME Type, （linux可以通过file -i <filename>查看文件MIME Type）
          type: 'text/plain; charset=utf-8'
        })
        const link = document.createElement('a')
        link.download = res.headers.filename
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
      }).catch(err => {
        console.log(err)
      })
    },
    // 将时间戳转换为指定格式的UTC时间
    formatDate(timestamp) {
      const objDate = new Date(timestamp)
      const year = objDate.getUTCFullYear()
      const month = objDate.getUTCMonth() + 1
      const day = objDate.getUTCDate()
      // const hour = objDate.getUTCHours()
      // const minute = objDate.getUTCMinutes()
      // const seconds = objDate.getUTCSeconds()
      // const ms = objDate.getUTCMilliseconds() / 1000
      return year + '年' + month + '月' + day + '日 '
    },
    // |<
    loadOldest() {
      this.getContainerLog(
        this.beginningOfLogFile,
        this.oldestTimestamp,
        0,
        -this.maxLogSize - this.logsPerView,
        -this.maxLogSize,
        false,
        false
      )
    },
    // >|
    loadNewest() {
      this.getContainerLog(
        this.endOfLogFile,
        this.newestTimestamp,
        0,
        this.maxLogSize,
        this.maxLogSize + this.logsPerView,
        false,
        false
      )
    },
    // <
    loadOlder() {
      this.getContainerLog(
        this.currentSelection.logFilePosition,
        this.currentSelection.referencePoint.timestamp,
        this.currentSelection.referencePoint.lineNum,
        this.currentSelection.offsetFrom - this.logsPerView,
        this.currentSelection.offsetFrom,
        false,
        false
        // this.scrollToBottom.bind(this),
      )
    },
    // >
    loadNewer() {
      this.getContainerLog(
        this.currentSelection.logFilePosition,
        this.currentSelection.referencePoint.timestamp,
        this.currentSelection.referencePoint.lineNum,
        this.currentSelection.offsetTo,
        this.currentSelection.offsetTo + this.logsPerView,
        false,
        false
        // this.scrollToTop.bind(this),
      )
    }
  }
}
</script>

<style type="scss" scoped>
.tooltip {
  border-bottom: 1px dashed;
}

.content-main {
  /*不能使用flex:1,它会使monacoEditor的内容不随浏览器窗口变化而变化*/
  /*flex:1;*/
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.log-content-header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #2e95d5;
  display: flex;
  flex-direction: row;
}

.log-content-header div {
  margin: 0 2px;
}

.log-content-header div span {
  background-color: #a7a7ab;
}

.log-content {
  flex: 1;
  overflow: auto;
  background-color: #262626;
}

.log-content-buttom {
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.log-content-buttom div {
  margin: 0 2px
}

.log-content-buttom div input {
  vertical-align: middle;
}

.log-content-buttom div span {
  margin: 0 6px;
}

.svg-icon {
  display: block;
  margin: 0 10px;
}

.svg-icon:hover {
  background-color: #e0e0e3;
}

.pages {
  flex: 1;
  display: flex;
  justify-content: center;
}

</style>
