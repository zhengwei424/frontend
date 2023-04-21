import request from '@/utils/request'

export function getNodesInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/cluster/nodes`,
    method: 'get'
  })
}

export function deleteNode(node) {
  return request({
    url: `/cluster/node/delete?node=${node}`,
    method: 'post'
  })
}

export function updateNode(nodeInfo) {
  return request({
    url: '/cluster/node/update',
    method: 'post',
    data: nodeInfo
  })
}

export function getNode(node) {
  return request({
    url: `/cluster/node/get?node=${node}`,
    method: 'get'
  })
}
