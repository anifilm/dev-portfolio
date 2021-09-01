<script>
  import { movies, message, loading } from '~/store/movie';
	import MovieCard from '~/components/MovieCard.svelte';
  import Loader from '~/components/Loader.svelte';
</script>

<div class:no-result={!$movies.length} class="movie-list">
  <div class="message">
    {$message}
  </div>
  <div class="movies">
    {#each $movies as movie (movie.imdbID)}
      <MovieCard movie={movie} />
    {/each}
  </div>
  {#if $loading}
    <Loader />
  {/if}
</div>

<style lang="scss">
  .movie-list {
    margin-top: 30px;
    padding: 10px;
    background-color: $color--area;
    border-radius: 4px;
    text-align: center;
    &.no-result {
      padding: 70px 0;
    }
    .message {
      color: $color--white-20;
      font-size: 20px;
      text-align: center;
    }
    .movies {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
