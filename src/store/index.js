import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      activeNav: 'userProfile',
    }
  },
  mutations: {
    setActiveNav(state, page) {
      state.activeNav = page;
    },
  },
});

export default store;