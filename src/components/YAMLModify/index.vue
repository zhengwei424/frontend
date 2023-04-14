<template>
  <div class="content-main">
    <div class="edit-content-header">
      <div>Kind:<span>{{ currentTab.resourceType }}</span></div>
      <div>Namespace:<span>{{ currentTab.namespace }}</span></div>
      <div>Name:<span>{{ currentTab.resourceName }}</span></div>
      <div><el-checkbox v-model="diff">diff</el-checkbox></div>
      <div style="flex:1" />
      <!--popover点击弹出错误信息？？？？？？？？？？？？？？？？？？？？？？？？-->
      <div><button @click="editCancel">Cancel</button></div>
      <div><button @click="editSave">Save</button></div>
      <div><button @click="editSaveAndClose">Save&Close</button></div>
    </div>
    <div class="edit-content">
      <MonacoEditor
        :key="diff"
        :diff-editor="diff"
        :original="originValue"
        language="yaml"
        theme="vs"
        :options="monacoOptions"
        :value="currentTab.resourceValue"
        @input="onChange"
      />
    </div>
  </div>
</template>

<script>
// 引入monaco-editor编辑器
import MonacoEditor from 'monaco-editor-vue'
import { updatePod } from '@/api/kubernetes/workload/pod'
import yaml from 'js-yaml'

export default {
  name: 'YAMLModify',
  components: {
    MonacoEditor
  },
  props: {
    currentTab: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // monaco-editor options  https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html#EditorOptions
      monacoOptions: {
        automaticLayout: true
      },
      // monaco-editor是否启用diff-editor
      diff: false,
      // monaco-editor value changed
      changeValue: '',
      // yaml 格式错误
      yamlError: ''
    }
  },
  computed: {
    // 复制currentTab.resourceValue
    originValue() {
      return yaml.dump(yaml.load(this.currentTab.resourceValue))
    }
  },
  methods: {
    modify() {
      const value = yaml.load(this.changeValue)
      console.log('yamlError:', this.yamlError)
      // 没有yaml格式错误就向服务器提交数据
      if (!this.yamlError) {
        // 将修改后内容发送给后端
        new Promise((resolve, reject) => {
          if (this.currentTab.resourceType === 'Pod') {
            updatePod(value).then(response => {
              if (response.msg === 'ok') {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.$emit('closeEditor', false)
                resolve(response.msg)
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败'
                })
                reject(response.msg)
              }
            }).catch(err => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
              reject(err)
            })
          }
        })
      }
    },
    // 关闭编辑器
    close() {
      this.$emit('close', this.currentTab.id)
    },
    editCancel() {
      this.close()
    },
    editSave() {
      this.modify()
    },
    editSaveAndClose() {
      this.modify()
      this.close()
    },
    onChange(value) {
      this.changeValue = value
      // 判断yaml内容是否有格式错误
      try {
        this.yamlError = ''
        yaml.loadAll(this.changeValue)
      } catch (err) {
        this.yamlError = err.message
      }
    }
  }
}
</script>

<style scoped>
.content-main {
  /*不能使用flex:1,它会使monacoEditor的内容不随浏览器窗口变化而变化*/
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.edit-content-header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #2e95d5;
  display: flex;
  flex-direction: row;
}

.edit-content-header div {
  margin: 0 2px;
}

.edit-content-header div span {
  background-color: #a7a7ab;
}

.edit-content {
  flex: 1;
  overflow: auto;
}
</style>
