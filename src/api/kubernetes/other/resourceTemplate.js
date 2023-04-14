import request from '@/utils/request'

export function getResourceTemplate(resource) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/other/template?resource=${resource}`,
    method: 'get'
  })
}
