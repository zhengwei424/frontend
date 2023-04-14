<template>
  <!--top参数表示弹出框距离顶部的距离-->
  <el-dialog
    :title="title"
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
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/gfm/gfm'
// import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter'
// 全局上下文中执行一次xxx.js
import 'codemirror/mode/yaml/yaml'
// 主题样式
import 'codemirror/theme/rubyblue.css'

require('script-loader!js-yaml/dist/js-yaml.min')
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/yaml-lint'

import { resourcesCreate } from '@/api/kubernetes/resourcesCreate'
// import jsyaml from 'js-yaml'

export default {
  name: 'YAMLCreator',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      default: '新建'
    },
    namespace: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      isShow: this.showDialog,
      isObj: false,
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
      // this.yamlEditor.setValue(this.value)
      // this.yamlEditor.setValue(this.toYAML(this.value))
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
      // // 获取yaml文件内容
      // const resources = []
      // jsyaml.loadAll(this.yamlEditor.getValue(), function(resource) {
      //   // 让后端去判断资源类型是否合法吧
      //   resources.push(resource)
      // })
      // 参考kubernetes clusterDashboard
      const resources = {
        'name': '', // 应该是文件名称？？？
        'namespace': this.namespace, // 获取前端选择的namespace，传给后端做比较（比较前端选择的namespace和新建yaml中的namespace是否一致）
        'content': this.yamlEditor.getValue(),
        'validate': true // 参考kubernetes dashboard字段，暂时无效
      }
      console.log(typeof (resources))
      // 将修改后内容发送给后端
      console.log('resources', resources)
      if (resources) {
        new Promise((resolve, reject) => {
          resourcesCreate(resources).then(response => {
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
    }
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
