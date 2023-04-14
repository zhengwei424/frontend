import request from '@/utils/request'

export function getNodesInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/cluster/nodes`,
    method: 'get'
  })
}
