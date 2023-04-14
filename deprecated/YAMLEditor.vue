<template>
  <!--top参数表示弹出框距离顶部的距离-->
  <el-dialog
    :title="yamlTitle"
    :visible.sync="isShow"
    :fullscreen="fullscreen"
    :show-close="false"
    :modal-append-to-body="false"
    width="50%"
    height="50%"
    top="5vh"
    center
    @close="handleClose"
  >
    <template v-slot:title>
      <span class="el-dialog__title">{{ yamlTitle }}</span>
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
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/gfm/gfm'
import jsyaml from 'js-yaml'
// import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter'
// 全局上下文中执行一次xxx.js
import 'codemirror/mode/yaml/yaml'
// 主题样式
import 'codemirror/theme/rubyblue.css'

require('script-loader!js-yaml/dist/js-yaml.min')
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/yaml-lint'

import { updatePod } from '@/api/kubernetes/workload/pod'

export default {
  name: 'YAMLEditor',
  props: {
    showYaml: {
      type: Boolean,
      required: true,
      default: false
    },
    yamlValue: {
      type: Object,
      required: true,
      default: () => {
      }
    },
    yamlTitle: {
      type: String,
      default: '提示'
    }
  },
  data() {
    return {
      isShow: this.showYaml,
      isYAML: false, // 判断obj是否能转换为yaml
      isObj: false, // 判断yaml是否能反序列化为obj
      yamlEditor: '', // codemirror实例
      fullscreen: false, // 窗口是否全屏
      fullscreenIcon: 'exit-fullscreen' // 全屏图标
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.yamlEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        // mode: 'yaml-frontmatter',
        mode: 'yaml',
        gutters: ['CodeMirror-lint-markers'],
        theme: 'rubyblue',
        lineWrapping: false,
        lineNumbers: true,
        lint: true
      })
      // 使用mode: 'yaml-frontmatter'时，'---'开头，yaml文字才会有样式
      this.yamlEditor.setValue(this.toYAML(this.yamlValue))
      // myEditor.setValue(this.toYAML(this.value))
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
      const value = this.toObj(this.yamlEditor.getValue())
      if (this.isObj) {
        // 传递更新的value值到父组件的changed和input事件
        that.$emit('changed', value)
        // 将修改后内容发送给后端
        new Promise((resolve, reject) => {
          updatePod(value).then(response => {
            if (response.msg === 'ok') {
              that.$message({
                type: 'success',
                message: '保存成功'
              })
              that.$emit('closeEditor', false)
              resolve(response.msg)
            } else {
              that.$message({
                type: 'error',
                message: '保存失败'
              })
              reject(response.msg)
            }
          }).catch(err => {
            that.$message({
              type: 'error',
              message: '保存失败'
            })
            reject(err)
          })
        })
      }
    },
    toYAML(value) {
      let yamlData
      try {
        yamlData = jsyaml.dump(value)
        this.isYAML = true
      } catch (e) {
        this.isYAML = false
        yamlData = ''
        this.$message('转换YAML失败')
        console.log('转换YAML失败', e)
      }
      return yamlData
    },
    toObj(jsonString) {
      let obj
      try {
        obj = jsyaml.load(jsonString)
        this.isObj = true
      } catch (e) {
        this.isObj = false
        obj = {}
        this.$message.error('YAML格式错误')
        console.log('YAML格式错误', e)
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

/*不生效？？？？？？？*/
.el-dialog__wrapper .el-dialog--center .el-dialog__footer {
  text-align: right;
}
</style>
