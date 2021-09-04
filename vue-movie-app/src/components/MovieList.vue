<template>
  <div>
    <p v-if="totalResults > 0">{{ totalResults }}건의 검색 결과가 있습니다.</p>
    <v-row v-masonry item-selector=".item">
      <v-col
        v-for="movie in movies"
        :key="movie.imdbID"
        v-masonry-tile
        class="item"
        cols="12"
        lg="3"
        md="3"
        sm="6"
      >
        <v-card>
          <v-img
            :src="posterSrc(movie.Poster)"
            :alt="movie.Title"
            :height="posterHeight(movie.Poster)"
          >
            <template v-slot:placeholder>
              <div
                style="background: gray; height: 100%; color: white; line-height: 300px; text-align: center;"
              >
                no poster image
              </div>
            </template>
          </v-img>
          <v-card-title>
            {{ movie.Title }}
          </v-card-title>
          <v-card-subtitle>
            {{ movie.Year }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Movies',
  computed: {
    movies() {
      return this.$store.state.movie.movies;
    },
    totalResults() {
      return this.$store.state.movie.totalResults;
    }
  },
  methods: {
    posterSrc(poster) {
      return poster === 'N/A' ? '' : poster;
    },
    posterHeight(poster) {
      return poster === 'N/A' ? 300 : 400;
    }
  }
};
</script>
