import request from '@/utils/request'

export function getReplicationControllersInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/replicationControllers?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteReplicationController(namespace, replicationController) {
  return request({
    url: `/workload/replicationController/delete?namespace=${namespace}&replicationController=${replicationController}`,
    method: 'post'
  })
}

export function updateReplicationController(replicationControllerInfo) {
  return request({
    url: '/workload/replicationController/update',
    method: 'post',
    data: replicationControllerInfo
  })
}

export function getReplicationController(namespace, replicationController) {
  return request({
    url: `/workload/replicationController/get?namespace=${namespace}&replicationController=${replicationController}`,
    method: 'get'
  })
}
