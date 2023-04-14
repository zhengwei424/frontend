import { getPersistentVolumeClaimsInfo } from '@/api/kubernetes/storage/persistentVolumeClaim'

const actions = {
  getPersistentVolumeClaimsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getPersistentVolumeClaimsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETPERSISTENTVOLUMECLAIMSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETPERSISTENTVOLUMECLAIMSINFO(state, data) {
    state.persistentVolumeClaimsInfo = data
  }
}

const state = {
  persistentVolumeClaimsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
