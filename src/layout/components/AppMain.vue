<template>
  <div ref="app-main" class="app-main">
    <!--功能导航-->
    <div class="func-nav">
      <div class="resource_type">{{ resourceType }}</div>
      <div class="resource_length">{{ resourceLength }}&nbsp;items</div>
      <el-select v-model="ns" placeholder="Namespace">
        <el-option-group
          v-for="namespaces in namespacesOptions"
          :key="namespaces.label"
          :label="namespaces.label"
        >
          <el-option
            v-for="(item, index) in namespaces.options"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-option-group>
      </el-select>
      <el-input v-model="search" style="width: 200px" placeholder="Search" suffix-icon="el-icon-search" />
    </div>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" :search="search" @getResourceType="getResourceType" @getResourceLength="getResourceLength" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      // namespace
      ns: 'default',
      // 搜索
      search: '',
      // 资源类型
      resourceType: '',
      // 资源数量
      resourceLength: 0
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    namespacesOptions() {
      return this.$store.getters['namespacesInfo/namespacesOptions']
    }
  },
  watch: {
    ns: {
      handler(value) {
        this.$store.commit('currentNamespace/SETCURRENTNAMESPACE', value)
      }
    }
  },
  methods: {
    getResourceType(value) {
      this.resourceType = value
    },
    getResourceLength(value) {
      this.resourceLength = value
    }
  }
}
</script>

<style scoped>
.app-main {
  /*vh只当前屏幕可见高度1%，100px为两个导航栏高度，则剩下的就是app-main的高度*/
  height: calc(100vh - 82px);
  overflow: hidden;
  border: 10px solid #eeeeef;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.func-nav {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #EBEEF5;
}

.resource_type {
  text-align: left;
  height: 50px;
  width: 300px;
  line-height: 50px;
  font-weight: bolder;
  padding: 0 10px;
  color: #909399;
}

.resource_length {
  flex: 1;
  text-align: center;
  height: 50px;
  line-height: 50px;
  color: #909399;
}
.el-select, .el-input {
  line-height: 50px;
  margin: 0 10px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
