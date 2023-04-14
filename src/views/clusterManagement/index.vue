<template>
  <div class="manage-cluster">
    <p>集群管理</p>
    <el-upload
      class="upload-kubeconfig"
      :action="url"
      :headers="headers"
      :show-file-list="false"
      multiple
      :on-success="getClusterContext"
    >
      <!--      <el-button size="small" type="primary">点击上传</el-button>-->
      <el-button type="primary" class="circle">
        <div class="horizontal" />
        <div class="vertical" />
      </el-button>
    </el-upload>
    <el-table
      :data="clusterManagementInfo"
      style="width: 100%"
      @row-click="connectingCluster"
    >
      <el-table-column
        prop="context-name"
        label="context"
      />
      <el-table-column
        prop="server"
        label="server"
      />
      <el-table-column
        prop="cluster"
        label="cluster"
      />
      <el-table-column
        prop="user"
        label="user"
      />
      <el-table-column
        prop="status"
        label="status"
      />
    </el-table>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getClusterKubeConfigPartInfo } from '@/api/kubernetes/clusterManagement/clusterKubeConfigPartInfo'
import { connectCluster } from '@/api/kubernetes/clusterManagement/connectCluster'

export default {
  name: 'ClusterManagement',
  data() {
    return {
      url: `${process.env.VUE_APP_BASE_API}/clusterManagement/upload`,
      clusterManagementInfo: []
    }
  },
  computed: {
    headers() {
      return { 'token': getToken() }
    }
  },
  mounted() {
    this.getClusterContext()
  },
  methods: {
    // 向后端获取简单的集群配置信息
    getClusterContext() {
      getClusterKubeConfigPartInfo().then(res => {
        if (res.code === 0) {
          this.clusterManagementInfo = res.data
          this.clusterManagementInfo.forEach(item => {
            item.status = 'disconnected'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 双击连接到指定集群
    connectingCluster(row) {
      const contextInfo = {
        'id': row['id'],
        'context-name': row['context-name']
      }
      connectCluster(contextInfo).then(res => {
        if (res.code === 0) {
          this.$router.push('/clusterDashboard')
          console.log('连接成功，可以切换状态')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.upload-kubeconfig {
  position: absolute;
  bottom: 30px;
  right: 20px;
}

.manage-cluster {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.circle {
  background-color: rgba(66, 66, 224, 0.911);
  width: 60px;
  height: 60px;
  border-radius: 30px;
  z-index: -1;
}
.horizontal {
  background-color: aliceblue;
  height: 2px;
  width: 10px;
  z-index: 1;
  position: absolute;
  top: 29px;
  left: 25px;

}
.vertical {
  background-color: aliceblue;
  height: 10px;
  width: 2px;
  z-index: 1;
  position: absolute;
  top: 25px;
  left: 29px;
}
</style>

