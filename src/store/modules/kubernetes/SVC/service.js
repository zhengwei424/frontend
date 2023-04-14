import { getServicesInfo } from '@/api/kubernetes/SVC/service'

const actions = {
  getServicesInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getServicesInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETSERVICESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETSERVICESINFO(state, data) {
    state.servicesInfo = data
  }
}

const state = {
  servicesInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
