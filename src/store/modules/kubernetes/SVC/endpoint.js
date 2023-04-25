import { getEndpointsInfo } from '@/api/kubernetes/SVC/endpoint'

const actions = {
  getEndpointsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getEndpointsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETENDPOINTSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETENDPOINTSINFO(state, data) {
    state.endpointsInfo = data
  }
}

const state = {
  endpointsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
