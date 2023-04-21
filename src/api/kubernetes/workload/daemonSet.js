import request from '@/utils/request'

export function getDaemonSetsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/daemonSets?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteDaemonSet(namespace, daemonSet) {
  return request({
    url: `/workload/daemonSet/delete?namespace=${namespace}&daemonSet=${daemonSet}`,
    method: 'post'
  })
}

export function updateDaemonSet(daemonSetInfo) {
  return request({
    url: '/workload/daemonSet/update',
    method: 'post',
    data: daemonSetInfo
  })
}

export function getDaemonSet(namespace, daemonSet) {
  return request({
    url: `/workload/daemonSet/get?namespace=${namespace}&daemonSet=${daemonSet}`,
    method: 'get'
  })
}
