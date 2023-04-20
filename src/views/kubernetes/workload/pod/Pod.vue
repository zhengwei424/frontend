<template>
  <div class="table-view">
    <el-table
      :data="resourceData"
      style="width: 100%;"
      height="100%"
      class="table"
    >
      <!--排序必须设置prop才生效，无论是否使用插槽-->
      <el-table-column
        sortable
        label="Name"
        prop="name"
      >
        <template slot-scope="scope">
          <el-tooltip
            placement="top"
            effect="dark"
          >
            <div slot="content">{{ scope.row.name }}</div>
            <div class="name">
              {{ scope.row.name }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!--v-if用于显示和隐藏表头-->
      <!--prop的值是指每一列的字段名称所对应的podsInfo中的字段名称-->
      <el-table-column
        v-if="colOptions.labels.isShow"
        sortable
        label="Labels"
        prop="labels"
      >
        <template slot-scope="scope">
          <div v-for="(v, k, i) in scope.row.labels" :key="i" class="labels">{{ k }}:{{ v }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="colOptions.namespace.isShow"
        sortable
        label="Namespace"
        prop="namespace"
      />
      <el-table-column
        v-if="colOptions.containers.isShow"
        sortable
        label="Containers"
        prop="containers"
      >
        <template slot-scope="scope">
          <div
            v-for=" (item, index) in getContainersStatusList(scope.row.containers)"
            :key="index"
            class="containers"
          >
            <el-tooltip effect="dark" placement="right">
              <div slot="content" v-html="item.tipContent" />
              <div :style="'background-color: ' + item.statusColor + ';width: 100%;height: 100%'" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="colOptions.status.isShow"
        sortable
        label="Status"
        prop="status"
      >
        <template slot-scope="scope">
          <div
            v-if="scope.row.status === 'Running'"
            class="status"
            style="color: #57bd54;"
          >{{ scope.row.status }}
          </div>
          <div
            v-else
            class="status"
            style="color: red;"
          >{{ scope.row.status }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="colOptions.restartCount.isShow"
        sortable
        label="Restarts"
        prop="restartCount"
      />
      <el-table-column
        v-if="colOptions.controlledBy.isShow"
        sortable
        label="Controlled By"
        prop="controlledBy"
      />
      <el-table-column
        v-if="colOptions.nodeIP.isShow"
        sortable
        label="Node"
        prop="nodeIP"
      />
      <el-table-column
        v-if="colOptions.qos.isShow"
        sortable
        label="Qos"
        prop="qos"
      />
      <el-table-column
        v-if="colOptions.startTime.isShow"
        sortable
        label="Age"
        prop="startTime"
      />
      <el-table-column>
        <template slot="header">
          <!--弹出框-->
          <el-popover
            placement="right-start"
            width="50px"
            trigger="click"
          >
            <svg-icon slot="reference" icon-class="dots" />
            <el-checkbox-group v-model="colSelected">
              <el-checkbox v-for="(v, k) in colOptions" :key="k" :label="v.label" />
            </el-checkbox-group>
          </el-popover>
        </template>
        <!-- 下拉工具菜单(需要用template以及slot-scope="scope"?????????，否则菜单无法列出） -->
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <svg-icon icon-class="dots" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit-outline" @click.native="podEdit(scope.row)">edit/view
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-document" @click.native="podLog(scope.row)">log</el-dropdown-item>
              <el-dropdown-item icon="el-icon-monitor" @click.native="podTerminal(scope.row)">terminal
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="deleteCurrentPod(scope.row)">delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getPod, deletePod } from '@/api/kubernetes/workload/pod'
import YAML from 'js-yaml'

export default {
  name: 'Pod',
  props: {
    // 搜索
    search: {
      type: String,
      default: ''
    }
  },
  // eslint-disable-next-line vue/no-unused-components
  data() {
    return {
      // 表头所有列名称
      colOptions: {
        labels: {
          label: 'Labels',
          isShow: false
        },
        namespace: {
          label: 'Namespace',
          isShow: true
        },
        containers: {
          label: 'Containers',
          isShow: true
        },
        status: {
          label: 'Status',
          isShow: true
        },
        restartCount: {
          label: 'Restarts',
          isShow: true
        },
        controlledBy: {
          label: 'Controlled By',
          isShow: true
        },
        nodeIP: {
          label: 'Node',
          isShow: true
        },
        qos: {
          label: 'Qos',
          isShow: true
        },
        startTime: {
          label: 'Age',
          isShow: true
        }
      },
      // 获取被选择项
      colSelected: ['Namespace', 'Containers', 'Status', 'Restarts', 'Controlled By', 'Node', 'Qos', 'Age'],
      // pod event
      podEvent: []
    }
  },
  computed: {
    podsInfo() {
      return this.$store.state.podsInfo.podsInfo
    },
    resourceData() {
      return this.podsInfo.filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()))
    },
    currentNamespace() {
      return this.$store.state.currentNamespace.currentNamespace
    },
    // 获取需要显示隐藏的表头列表
    tableTitle() {
      const arr = []
      Object.keys(this.colOptions).forEach(key => {
        arr.push(this.colOptions[key].label)
      })
      return arr
    }
  },
  watch: {
    currentNamespace: {
      handler() {
        this.fetchData()
      }
    },
    resourceData() {
      this.$emit('getResourceLength', this.resourceData.length)
    },
    // 显示/隐藏表头逻辑
    colSelected: {
      handler(newValue, oldValue) {
        this.tableTitle.filter(i => {
          // 表示tableTitle中的每一项在colSelected中的索引值，不存在为-1
          if (this.colSelected.indexOf(i) < 0) {
            Object.keys(this.colOptions).forEach(key => {
              if (this.colOptions[key].label === i) {
                // 无法渲染??????-->需要在每一列设置:key以及v-if，v-show不生效。
                this.colOptions[key].isShow = false
              }
            })
          } else {
            Object.keys(this.colOptions).forEach(key => {
              if (this.colOptions[key].label === i) {
                // 无法渲染??????-->需要在每一列设置:key以及v-if，v-show不生效。
                this.colOptions[key].isShow = true
              }
            })
          }
        })
      }
    }
  },
  mounted() {
    this.fetchData()
    this.$emit('getResourceType', this.$options.name)
  },
  methods: {
    fetchData() {
      this.$store.dispatch('podsInfo/getPodsInfo', this.currentNamespace)
    },
    // 优先判断container状态及颜色等，避免使用v-for和v-if嵌套
    getContainersStatusList(containers) {
      const results = []
      for (const c of containers) {
        const c_status = { statusColor: '', tipContent: '' }
        if (c.state === 'Running') {
          c_status.statusColor = '#57bd54'
          c_status.tipContent = 'name: ' + c.name + '<br/>' + 'containerID: ' + c.containerID + '<br/>' + 'startedAt: ' + c.startedAt
        } else {
          c_status.statusColor = 'orange'
          c_status.tipContent = 'name: ' + c.name + '<br/>' + 'reason: ' + c.reason + '<br/>' + 'message: ' + c.message
        }
        results.push(c_status)
      }
      return results
    },
    deleteCurrentPod(row) {
      this.$confirm('即将从' + row.namespace + '命名空间删除' + row.name + ',是否继续？', 'Pod', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        new Promise((resolve, reject) => {
          deletePod(row.namespace, row.name).then(response => {
            if (response.msg === 'ok') {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
            resolve()
          }).catch(err => {
            reject(err)
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取完整的pod yaml文件
    async getPodYaml(pod) {
      // let value = ''
      // getPod(pod.namespace, pod.name).then(response => {
      //   value = response.data
      // }).catch(error => {
      //   console.log(error)
      //   value = ''
      // })
      // return value  // return的值为空，是因为axios是异步操作，在getPod请求还没有完成时就返回了value=''
      // 解决办法：使用async + await，async声明方法为异步方法，await等待异步操作执行完成
      let value = ''
      await getPod(pod.namespace, pod.name).then(response => {
        value = response.data
      }).catch(error => {
        console.log(error)
        value = ''
      })
      return value
    },
    // 获取容器名
    getContainersName(pod) {
      const containers = []
      if (pod.containers) {
        pod.containers.forEach(item => {
          containers.push(item.name)
        })
      }
      return containers
    },
    // item: { type: xxx(terminal,log,podinfo,create), language: xxx(json,yaml), shell: xxx(bash, sh), pod: xxx, container: xxx}
    podEdit(pod) {
      // 异步方法返回值为promise<>,获取promiseResult需要用.then(res=>{})
      this.getPodYaml(pod).then(res => {
        const data = {
          type: 'edit',
          resourceType: 'Pod',
          resourceName: pod.name,
          resourceValue: YAML.dump(res),
          // resourceValue: JSON.stringify(res, null, 4),
          namespace: pod.namespace,
          language: ['json', 'yaml'],
          containers: this.getContainersName(pod)
        }
        this.$store.commit('tabsList/ADDTAB', data)
      })
    },
    podLog(pod) {
      this.$store.commit(
        'tabsList/ADDTAB',
        {
          type: 'log',
          resourceType: 'Pod',
          resourceName: pod.name,
          namespace: pod.namespace,
          containers: this.getContainersName(pod)
        })
    },
    podTerminal(pod) {
      this.$store.commit(
        'tabsList/ADDTAB',
        {
          type: 'terminal',
          resourceType: 'Pod',
          resourceName: pod.name,
          namespace: pod.namespace,
          shell: ['sh', 'bash'],
          containers: this.getContainersName(pod)
        })
    }
  }
}
</script>

<style scoped>
.table-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table {
  display: flex;
  flex-direction: column;
}

.el-table__body-wrapper {
  flex: 1;
}

/* pod name */
.name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/*表格带有label字段时的label内容样式*/
.labels {
  /*设置边框背景颜色*/
  background-color: #58aef6;
  /*设置圆边框四个角的半径*/
  border-radius: 8px;
  /*设置边框线宽度，solid表示实线*/
  border: 0px solid;
  /*设置div自适应文字宽度*/
  width: fit-content;
  /*设置边框之间的上下间距*/
  margin-top: 8px;
  /*设置文字颜色*/
  color: #ffffff;
  /*设置文字与边框的距离*/
  padding: 1px 5px;
  /*多行省略效果*/
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  /*这里是1行*/
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.containers {
  display: inline-block;
  margin: 0 5px;
  height: 8px;
  width: 8px;
  border-radius: 2px
}

.status {
  width: 60px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  font-weight: 400;
}

/*表头工具下拉菜单样式*/
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

/*表头工具下拉菜单样式*/
.el-checkbox, .el-checkbox__input {
  display: block;
}

</style>
