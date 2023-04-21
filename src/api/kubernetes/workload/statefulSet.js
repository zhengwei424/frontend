import request from '@/utils/request'

export function getStatefulSetsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/statefulSets?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteStatefulSet(namespace, statefulSet) {
  return request({
    url: `/workload/statefulSet/delete?namespace=${namespace}&statefulSet=${statefulSet}`,
    method: 'post'
  })
}

export function updateStatefulSet(statefulSetInfo) {
  return request({
    url: '/workload/statefulSet/update',
    method: 'post',
    data: statefulSetInfo
  })
}

export function getStatefulSet(namespace, statefulSet) {
  return request({
    url: `/workload/statefulSet/get?namespace=${namespace}&statefulSet=${statefulSet}`,
    method: 'get'
  })
}
