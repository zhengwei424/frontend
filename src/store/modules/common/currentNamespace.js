const mutations = {
  SETCURRENTNAMESPACE(state, data) {
    state.currentNamespace = data
  }
}

const state = {
  currentNamespace: 'default'
}

export default {
  namespaced: true,
  mutations,
  state
}
