import request from '@/utils/request'

export function getReplicaSetsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/replicaSets?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteReplicaSet(namespace, replicaSet) {
  return request({
    url: `/workload/replicaSet/delete?namespace=${namespace}&replicaSet=${replicaSet}`,
    method: 'post'
  })
}

export function updateReplicaSet(replicaSetInfo) {
  return request({
    url: '/workload/replicaSet/update',
    method: 'post',
    data: replicaSetInfo
  })
}

export function getReplicaSet(namespace, replicaSet) {
  return request({
    url: `/workload/replicaSet/get?namespace=${namespace}&replicaSet=${replicaSet}`,
    method: 'get'
  })
}
