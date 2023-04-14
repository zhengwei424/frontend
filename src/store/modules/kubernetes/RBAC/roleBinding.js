import { getRoleBindingsInfo } from '@/api/kubernetes/RBAC/roleBinding'

const actions = {
  getRoleBindingsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getRoleBindingsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETROLEBINDINGSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETROLEBINDINGSINFO(state, data) {
    state.roleBindingsInfo = data
  }
}

const state = {
  roleBindingsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
