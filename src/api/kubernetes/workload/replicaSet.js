import request from '@/utils/request'

export function getReplicaSetsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/replicaSets?namespace=${namespace}`,
    method: 'get'
  })
}

