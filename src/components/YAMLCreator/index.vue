<template>
  <div class="content-main">
    <div class="create-content-header">
      <div>
        <el-select v-model="templateValue" placeholder="Select Template...">
          <el-option
            v-for="(item, index) in resourceTemplate"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="flex:1" />
      <div><button @click="createCancel">Cancel</button></div>
      <div><button @click="createResource">Create</button></div>
      <div><button @click="createAndClose">Create&Close</button></div>
    </div>
    <div class="create-content">
      <MonacoEditor
        language="yaml"
        theme="vs"
        :options="monacoOptions"
        :value="editValue"
        @input="onChange"
      />
    </div>
  </div>
</template>

<script>
import MonacoEditor from 'monaco-editor-vue'
import yaml from 'js-yaml'
import { getResourceTemplate } from '@/api/kubernetes/other/resourceTemplate'
import { resourcesCreate } from '@/api/kubernetes/other/resourcesCreate'

export default {
  name: 'YAMLCreator',
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
      // monaco-editor value
      editValue: '',
      // yaml 格式错误
      yamlError: '',
      // monaco-editor options  https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html#EditorOptions
      monacoOptions: {
        automaticLayout: true
      },
      // 被选中资源模板对应的yaml内容
      templateValue: '',
      resourceTemplate: [
        {
          // 选项标签对应的值（yaml内容）
          value: 'ClusterRole',
          // select选项
          label: 'ClusterRole'
        },
        {
          value: 'ClusterRoleBinding',
          label: 'ClusterRoleBinding'
        },
        {
          value: 'ConfigMap',
          label: 'ConfigMap'
        },
        {
          value: 'CronJob',
          label: 'CronJob'
        },
        {
          value: 'DaemonSet',
          label: 'DaemonSet'
        },
        {
          value: 'Deployment',
          label: 'Deployment'
        },
        {
          value: 'Ingress',
          label: 'Ingress'
        },
        {
          value: 'Job',
          label: 'Job'
        },
        {
          value: 'NetworkPolicy',
          label: 'NetworkPolicy'
        },
        {
          value: 'PersistentVolume',
          label: 'PersistentVolume'
        },
        {
          value: 'PersistentVolumeClaim',
          label: 'PersistentVolumeClaim'
        },
        {
          value: 'Pod',
          label: 'Pod'
        },
        {
          value: 'ReplicaSet',
          label: 'ReplicaSet'
        },
        {
          value: 'ReplicationController',
          label: 'ReplicationController'
        },
        {
          value: 'Role',
          label: 'Role'
        },
        {
          value: 'RoleBinding',
          label: 'RoleBinding'
        },
        {
          value: 'Secret',
          label: 'Secret'
        },
        {
          value: 'Service',
          label: 'Service'
        },
        {
          value: 'StatefulSet',
          label: 'StatefulSet'
        }
      ]
    }
  },
  computed: {
    currentNamespace() {
      return this.$store.state.currentNamespace.currentNamespace
    }
  },
  watch: {
    // 当模板选项改变时，修改monaco-editor的值
    templateValue: {
      handler(value) {
        getResourceTemplate(value).then((response) => {
          this.editValue = response.data
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  },
  methods: {
    // 创建资源
    create() {
      // 参考kubernetes clusterDashboard
      const resources = {
        'name': '', // 应该是文件名称？？？
        'namespace': this.currentNamespace, // 获取前端选择的namespace，传给后端做比较（比较前端选择的namespace和新建yaml中的namespace是否一致）
        'content': this.editValue,
        'validate': true // 参考kubernetes dashboard字段，暂时无效
      }
      // 没有yaml格式错误就向服务器提交数据
      if (!this.yamlError) {
        new Promise((resolve, reject) => {
          resourcesCreate(resources).then(response => {
            if (response.msg === 'ok') {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
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
        })
      }
    },
    // 关闭编辑器
    close() {
      this.$emit('close', this.currentTab.id)
    },
    createCancel() {
      this.close()
    },
    createResource() {
      this.create()
    },
    createAndClose() {
      this.create()
      this.close()
    },
    onChange(value) {
      this.editValue = value
      // 判断yaml内容是否有格式错误
      try {
        this.yamlError = ''
        yaml.loadAll(this.editValue)
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
  /*flex:1;*/
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.create-content-header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #2e95d5;
  display: flex;
  flex-direction: row;
}

.create-content-header div {
  margin: 0 2px;
}

.create-content {
  flex: 1;
  overflow: auto;
}
</style>
