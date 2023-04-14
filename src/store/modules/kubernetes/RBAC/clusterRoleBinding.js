import { getClusterRoleBindingsInfo } from '@/api/kubernetes/RBAC/clusterRoleBinding'

const actions = {
  getClusterRoleBindingsInfo(context) {
    new Promise((resolve, reject) => {
      getClusterRoleBindingsInfo().then(response => {
        const { data } = response
        context.commit('GETCLUSTERROLEBINDINGSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETCLUSTERROLEBINDINGSINFO(state, data) {
    state.clusterRoleBindingsInfo = data
  }
}

const state = {
  clusterRoleBindingsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
