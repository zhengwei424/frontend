import { getConfigMapsInfo } from '@/api/kubernetes/config/configMap'

const actions = {
  getConfigMapsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getConfigMapsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETCONFIGMAPSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETCONFIGMAPSINFO(state, data) {
    state.configMapsInfo = data
  }
}

const state = {
  configMapsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
