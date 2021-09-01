import Vue from 'vue';
import Vuex from 'vuex';

import todoApp from './todoApp';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    todoApp
  },
  // Data
  state: {

  },
  // Computed
  getters: {

  },
  // Methods (실제 값을 변경할 때, 비동기 불가)
  mutations: {

  },
  // Methods (일반 로직, 비동기 가능)
  actions: {

  }
});
