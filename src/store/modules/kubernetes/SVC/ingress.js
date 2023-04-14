import { getIngressesInfo } from '@/api/kubernetes/SVC/ingress'

const actions = {
  getIngressesInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getIngressesInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETINGRESSESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETINGRESSESINFO(state, data) {
    state.ingressesInfo = data
  }
}

const state = {
  ingressesInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
