import { getNetworkPoliciesInfo } from '@/api/kubernetes/SVC/networkPolicy'

const actions = {
  getNetworkPoliciesInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getNetworkPoliciesInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETNETWORKPOLICIESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETNETWORKPOLICIESINFO(state, data) {
    state.networkPoliciesInfo = data
  }
}

const state = {
  networkPoliciesInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
