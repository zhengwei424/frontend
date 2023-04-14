import request from '@/utils/request'

export function getReplicationControllersInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/replicationControllers?namespace=${namespace}`,
    method: 'get'
  })
}

