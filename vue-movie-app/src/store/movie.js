import axios from 'axios';

const API_KEY = '8fd5eae9';

export default {
  namespaced: true,
  state: () => ({
    title: '',
    loading: false,
    movies: [],
    totalResults: 0
  }),
  mutations: {
    //updateTitle(state, title) {
    //  state.title = title
    //},
    //updateLoading(state, loading) {
    //  state.loading = loading;
    //},
    updateState(state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key];
      });
    },
    pushIntoMovies(state, movies) {
      state.movies.push(...movies);
    }
  },
  actions: {
    fetchMovies({ state, commit }, pageNum) {
      return new Promise(async resolve => {
        const res = await axios.get(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${state.title}&page=${pageNum}`
        );
        commit('pushIntoMovies', res.data.Search);
        resolve(res.data);
      });
    },
    async searchMovies({ commit, dispatch }) {
      commit('updateState', {
        loading: true, // 로딩 애니메이션 시작
        movies: [], // 초기화
        totalResults: 0
      });

      const { totalResults } = await dispatch('fetchMovies', 1);
      const pageLength = Math.ceil(totalResults / 10);

      commit('updateState', {
        totalResults
      });

      if (pageLength > 1) {
        for (let i = 2; i <= pageLength; i += 1) {
          if (i > 4) break;
          await dispatch('fetchMovies', i);
        }
      }

      commit('updateState', {
        loading: false // 로딩 애니메이션 종료
      });
    }
  }
};
