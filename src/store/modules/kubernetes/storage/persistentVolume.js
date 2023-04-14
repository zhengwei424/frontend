import { getPersistentVolumesInfo } from '@/api/kubernetes/storage/persistentVolume'

const actions = {
  getPersistentVolumesInfo(context) {
    new Promise((resolve, reject) => {
      getPersistentVolumesInfo().then(response => {
        const { data } = response
        context.commit('GETPERSISTENTVOLUMESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETPERSISTENTVOLUMESINFO(state, data) {
    state.persistentVolumesInfo = data
  }
}

const state = {
  persistentVolumesInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
