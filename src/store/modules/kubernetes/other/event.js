import { getEventsInfo } from '@/api/kubernetes/other/event'

const actions = {
  getEventsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getEventsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETEVENTSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETEVENTSINFO(state, data) {
    state.eventsInfo = data
  },
  SETKINDANDNAME(state, data) {
    state.kind = data.kind
    state.name = data.name
  }
}

const state = {
  eventsInfo: [],
  kind: '',
  name: ''
}

const getters = {
  // 过滤出涉及kind和kind对应的name的event
  filterEvents(state) {
    const tmp = []
    for (const item of state.eventsInfo) {
      // if (item.involveObject_kind === state.kind && item.involveObject_name === state.name) {
      //   tmp.push(item)
      // }
      tmp.push(item)
    }
    return tmp
  }
}

export default {
  namespaced: true,
  actions,
  mutations,
  state,
  getters
}
