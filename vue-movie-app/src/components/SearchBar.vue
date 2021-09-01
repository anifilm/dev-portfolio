<template>
  <div>
    <v-text-field v-model="title" outlined @keypress.enter="searchMovies">
      <template v-slot:prepend-inner>
        <v-icon>search</v-icon>
      </template>
      <template v-slot:append>
        <v-progress-circular
          v-if="loading"
          size="24"
          clolr="primary"
          indeterminate
        />
      </template>
    </v-text-field>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SearchBar',
  computed: {
    title: {
      get() {
        return this.$store.state.movie.title;
      },
      set(title) {
        this.$store.commit('movie/updateState', { title });
      }
    },
    loading() {
      return this.$store.state.movie.loading;
    }
  },
  methods: {
    //searchMovies() {
    //  this.$store.dispatch('movie/searchMovies');
    //}
    ...mapActions('movie', ['searchMovies'])
  }
};
</script>
