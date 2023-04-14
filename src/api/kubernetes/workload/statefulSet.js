import request from '@/utils/request'

export function getStatefulSetsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/statefulSets?namespace=${namespace}`,
    method: 'get'
  })
}

