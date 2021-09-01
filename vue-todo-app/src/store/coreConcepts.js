export default {
  namespaced: true,
  // Data
  state: () => ({
    a: 123,
    b: []
  }),
  // Computed
  getters: {
    someGetter1(state, getters) {
      return state.a + 1;
    },
    someGetter2(state, getters) {
      return state.a + getters.someGetter1;
    }
  },
  // Methods (실제 값을 변경할 때, 비동기 불가)
  mutations: {
    someMutation(state, payload) {
      state.a = 789;
      state.b.push(payload);
    }
  },
  // Methods (일반 로직, 비동기 가능)
  actions: {
    someAction1({ state, getters, commit, dispatch }, payload) {
      state.a = 1; // 오류, 직접적인 값 변경 불가
      state.b.push(payload); // 오류, 직접적인 값 변경 불가
      commit('someMutation', payload);
    },
    someAction2(context, payload) {
      context.commit('someMutation');
      context.dispatch('someAction1', payload);
    }
  }
};
