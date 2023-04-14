import request from '@/utils/request'

export function getDaemonSetsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/daemonSets?namespace=${namespace}`,
    method: 'get'
  })
}

