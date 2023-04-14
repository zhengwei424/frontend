import request from '@/utils/request'

export function connectCluster(contextInfo) {
  return request({
    url: '/clusterManagement/connectCluster',
    method: 'post',
    data: contextInfo
  })
}
