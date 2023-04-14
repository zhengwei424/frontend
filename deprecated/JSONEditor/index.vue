<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    :fullscreen="fullscreen"
    :show-close="false"
    :modal-append-to-body="false"
    width="50%"
    height="50%"
    center
    @close="handleClose"
  >
    <template v-slot:title>
      <span class="el-dialog__title">{{ title }}</span>
      <div class="close" @click="handleClose">
        <svg-icon icon-class="close" />
      </div>
      <div class="split" />
      <div class="fullscreen" @click="handleFullScreen">
        <svg-icon :icon-class="fullscreenIcon" />
      </div>
    </template>
    <div class="editor">
      <textarea ref="textarea" />
    </div>
    <template v-slot:footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
// 核心文件
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/lib/codemirror'
import 'codemirror/mode/javascript/javascript' // 代码高亮必须引入

// JSON代码错误检查
require('script-loader!jsonlint')
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

// 主题样式
import 'codemirror/theme/rubyblue.css'
// 括号显示匹配
import 'codemirror/addon/edit/matchbrackets'
// 光标所在行(active line) 高亮
import 'codemirror/addon/selection/active-line'
// 全文高亮匹配鼠标所选内容
import 'codemirror/addon/scroll/annotatescrollbar'
import 'codemirror/addon/search/match-highlighter'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/searchcursor'
// 括号、引号编辑和删除时成对出现
import 'codemirror/addon/edit/closebrackets'
// 加载刷新
import 'codemirror/addon/display/autorefresh'
// 代码折叠(没有效果就把fold插件里的文件都导入一遍，再排除)
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
// 上两个时折叠核心js和css，下面这是实现括号折叠，将成对括号内容折叠起来
import 'codemirror/addon/fold/brace-fold'

export default {
  name: 'JSONEditor',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
      default: false
    },
    value: {
      type: Object,
      required: true,
      default: () => {
      }
    },
    title: {
      type: String,
      default: '提示'
    }
  },
  data() {
    return {
      isShow: this.showDialog,
      isJSON: false, // 判断obj是否能序列化为json
      isObj: false, // 判断json是否能反序列化为obj
      jsonEditor: '', // codemirror实例
      fullscreen: false, // 窗口是否全屏
      fullscreenIcon: 'exit-fullscreen' // 全屏图标
    }
  },
  // computed没有生命周期，什么时候调用，什么时候运行
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror
    }
  },
  // watch: {
  //   value(newValue) {
  //     const editorValue = this.myEditor.getValue()
  //     if (newValue !== editorValue) {
  //       this.myEditor.setValue(this.toJSON(newValue))
  //     }
  //   }
  // },
  mounted() {
    // nextTick()解决this.$refs undefined的问题
    this.$nextTick(() => {
      // 切换options
      this.jsonEditor = CodeMirror.fromTextArea(
        this.$refs.textarea,
        {
          lineNumbers: true,
          mode: 'application/json',
          foldGutter: true, // JSON代码折叠
          lineWrapping: false, // 不换行，超出边框由横向滚动条
          gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'], // 语法检测需要CodeMirror-lint-markers
          theme: 'rubyblue',
          autoRefresh: true, // 是会在初始化dom时刷新一次，其他时候需要通过插件的refresh方法手动刷新
          lint: true, // 语法检测
          autoCloseBrackets: true, // 自动闭合括号、引号
          matchBrackets: true, // 鼠标紧挨括号时，自动高亮匹配成对的括号
          styleActiveLine: true, // 光标所在行(active line) 高亮
          highlightSelectionMatches: {
            style: 'matchhighlight', // 对应import的高亮css
            minChars: 2, // 选择的最小字符
            delay: 100,
            wordsOnly: false,
            trim: true, // 去空格
            // showToken: /\w/,
            showToken: false,
            annotateScrollbar: true // 匹配到的内容在滚动条上出现位置高亮？？
          }
        }
      )
      this.jsonEditor.setValue(this.toJSON(this.value))
    })
  },
  methods: {
    handleFullScreen() {
      this.fullscreen = !this.fullscreen
      if (this.fullscreen === true) {
        this.fullscreenIcon = 'exit-fullscreen'
      } else {
        this.fullscreenIcon = 'fullscreen'
      }
    },
    handleClose() {
      // 传递false到closeEditor事件，销毁组件
      this.$emit('closeEditor', false)
    },
    handleSave() {
      const that = this
      const value = this.toObj(this.jsonEditor.getValue())
      if (this.isObj) {
        // 传递更新的value值到父组件的changed事件
        that.$emit('changed', value)
      }
    },
    toJSON(value) {
      let jsonData
      try {
        jsonData = JSON.stringify(value, null, 2)
        this.isJSON = true
      } catch (e) {
        this.isJSON = false
        jsonData = ''
        this.$message.error('JSON序列化失败')
        console.log('JSON序列化失败', e)
      }
      return jsonData
    },
    toObj(jsonString) {
      let obj
      try {
        obj = JSON.parse(jsonString)
        this.isObj = true
      } catch (e) {
        this.isObj = false
        obj = {}
        this.$message.error('JSON格式错误')
        console.log('JSON反序列化失败', e)
      }
      return obj
    }
    // 视图切换时刷新一次，如标签页切换
    // handleVisibleChange() {
    //   // 调用codemirror的refresh方法
    //   if(this.show = !this.show) {
    //     this.$nextTick(() => {
    //       this.myEditor && this.myEditor.refresh()
    //     })
    //   }
    // }
    // onCmReady(cm) {
    //   console.log('the editor is readied', cm)
    // },
    // onCmFocus(cm) {
    //   console.log('the editor is focus', cm)
    // },
    // onCmCodeChange(newCode) {
    //   console.log('this is new code', newCode)
    // }
  }
}
</script>

<style lang="scss" scoped>
/* 部分css在App.vue的全局style中，否则会导致codemirror的部分样式不生效 */
.el-dialog__header {
  height: 24px;
  width: 100%;
  margin-right: 10px;
}

.el-dialog__title {
  float: left;
}

.fullscreen, .close {
  width: 16px;
  height: 16px;
  float: right;
}

.split {
  width: 2px;
  height: 16px;
  background-color: rgba(0, 0, 0, 0.3);
  margin-left: 10px;
  margin-right: 10px;
  float: right;
}

.editor {
  height: 100%;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: 600px;
    }

    .CodeMirror-scroll {
      height: 600px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}

.el-dialog--center .el-dialog__footer {
  text-align: right;
}
</style>
