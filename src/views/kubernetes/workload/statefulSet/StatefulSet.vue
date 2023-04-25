<template>
  <div class="table-view">
    <el-table
      :data="resourceData"
      style="width: 100%;"
      height="100%"
      class="table"
    >
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
        v-if="colOptions.namespace.isShow"
        sortable
        label="Namespace"
        prop="namespace"
      />
      <el-table-column
        v-if="colOptions.replicas.isShow"
        sortable
        label="Replicas"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.readyReplicas === 0 && scope.row.replicas === 0" style="color: orange">
            {{ scope.row.readyReplicas }}/{{ scope.row.replicas }}</span>
          <span v-else-if="scope.row.readyReplicas === scope.row.replicas" style="color: #57bd54">
            {{ scope.row.readyReplicas }}/{{ scope.row.replicas }}</span>
          <span v-else style="color: red">{{ scope.row.readyReplicas }}/{{ scope.row.replicas }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="colOptions.creationTimestamp.isShow"
        sortable
        label="Age"
        prop="creationTimestamp"
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
              <el-dropdown-item icon="el-icon-edit-outline" @click.native="editStatefulSet(scope.row)">edit/view
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="deleteCurrentStatefulSet(scope.row)">delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉 -->
    <!--    <PodDrawer :drawer="drawer" :data="podInfo" @changeDrawer="changeDrawer" />-->
  </div>
</template>

<script>
import { getStatefulSet, deleteStatefulSet } from '@/api/kubernetes/workload/statefulSet'
import YAML from 'js-yaml'

export default {
  name: 'StatefulSet',
  props: {
    // 搜索
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 表头所有列名称
      colOptions: {
        namespace: {
          label: 'Namespace',
          isShow: true
        },
        replicas: {
          label: 'Replicas',
          isShow: true
        },
        creationTimestamp: {
          label: 'Age',
          isShow: true
        }
      },
      // 获取被选择项
      colSelected: ['Namespace', 'Replicas', 'Age']
    }
  },
  computed: {
    statefulSetsInfo() {
      return this.$store.state.statefulSetsInfo.statefulSetsInfo
    },
    resourceData() {
      return this.statefulSetsInfo.filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()))
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
      this.$store.dispatch('statefulSetsInfo/getStatefulSetsInfo', this.currentNamespace)
    },
    editStatefulSet(row) {
      getStatefulSet(row.namespace, row.name).then(res => {
        const tabData = {
          type: 'edit',
          resourceType: this.$options.name,
          resourceName: row.name,
          resourceValue: YAML.dump(res.data),
          namespace: row.namespace,
          language: ['json', 'yaml']
        }
        this.$store.commit('tabsList/ADDTAB', tabData)
      }).catch(error => {
        console.log(error)
      })
    },
    deleteCurrentStatefulSet(row) {
      this.$confirm('即将从' + row.namespace + '命名空间删除' + row.name + ',是否继续？', this.$options.name, {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        new Promise((resolve, reject) => {
          deleteStatefulSet(row.namespace, row.name).then(response => {
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
          message: '取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.table-view {
  display: flex;
  flex-direction: column;
  height: 0;
  flex: 1;
}

.name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

