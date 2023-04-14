import { getServiceAccountsInfo } from '@/api/kubernetes/RBAC/serviceAccount'

const actions = {
  getServiceAccountsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getServiceAccountsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETSERVICEACCOUNTSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETSERVICEACCOUNTSINFO(state, data) {
    state.serviceAccountsInfo = data
  }
}

const state = {
  serviceAccountsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
