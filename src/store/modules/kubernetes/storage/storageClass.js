import { getStorageClassesInfo } from '@/api/kubernetes/storage/storageClass'

const actions = {
  getStorageClassesInfo(context) {
    new Promise((resolve, reject) => {
      getStorageClassesInfo().then(response => {
        const { data } = response
        context.commit('GETSTORAGECLASSESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETSTORAGECLASSESINFO(state, data) {
    state.storageClassesInfo = data
  }
}

const state = {
  storageClassesInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
