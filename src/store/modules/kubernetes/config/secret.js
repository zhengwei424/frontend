import { getSecretsInfo } from '@/api/kubernetes/config/secret'

const actions = {
  getSecretsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getSecretsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETSECRETSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETSECRETSINFO(state, data) {
    state.secretsInfo = data
  }
}

const state = {
  secretsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
