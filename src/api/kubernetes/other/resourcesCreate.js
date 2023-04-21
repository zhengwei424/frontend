import request from '@/utils/request'

// 所有资源新建的入口
export function resourcesCreate(resources) {
  return request({
    url: '/resourcesCreate',
    method: 'post',
    data: resources
  })
}

