<template>
  <div>
    <el-table
      :data="networkPoliciesInfo"
      style="width: 100%"
    >
      <el-table-column
        sortable
        label="Name"
        prop="name"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="sendDataToDrawer(scope.row)">
            {{ scope.row.name }}
          </el-button>
        </template>
      </el-table-column>
      <!--v-if用于显示和隐藏表头-->
      <!--prop的值是指每一列的字段名称所对应的podsInfo中的字段名称-->
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
              <el-dropdown-item icon="el-icon-edit-outline" @click.native="showNetworkPolicyYaml(scope.row)">查看
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" @click.native="deleteCurrentNetworkPolicy(scope.row)">删除
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
export default {
  name: 'NetworkPolicy',
  data() {
    return {
      // 表头所有列名称
      colOptions: {
        creationTimestamp: {
          label: 'Age',
          isShow: true
        }
      },
      // 获取被选择项
      colSelected: ['Age']
    }
  },
  computed: {
    networkPoliciesInfo() {
      return this.$store.state.networkPoliciesInfo.networkPoliciesInfo
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
  },
  methods: {
    fetchData() {
      this.$store.dispatch('networkPoliciesInfo/getNetworkPoliciesInfo', this.currentNamespace)
    },
    sendDataToDrawer(value) {
      console.log(value)
    },
    showNetworkPolicyYaml(row) {

    },
    deleteCurrentNetworkPolicy(row) {

    }
  }
}
</script>

<style scoped>
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

