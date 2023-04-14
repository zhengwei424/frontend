import request from '@/utils/request'

export function getClusterKubeConfigPartInfo() {
  return request({
    url: '/clusterManagement/clusters',
    method: 'get'
  })
}
