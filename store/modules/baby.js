export default {
  namespaced: true,
  state: () => ({
    mom: '',
    linked:[],
  }),
  getters: {
    mom: state => state.mom,
    linked: state => state.linked,
  },
  mutations: {
    setMom(state, data) {
      state.mom = data;
    },
    setLinked(state, data) {
      state.linked = data;
    },
  },
}
