<script>
  import { link } from 'svelte-spa-router';
  import Loader from '~/components/Loader.svelte';

  export let movie;

  let imageLoading = true;

  // 포스터 이미지 로딩이 완료되면 로더 출력 종료
  if (movie.Poster === 'N/A') {
    imageLoading = false;
  } else {
    const img = document.createElement('img');
    img.src = movie.Poster;
    img.addEventListener('load', () => {
      imageLoading = false;
    });
  }
</script>

<a use:link href={`/movie/${movie.imdbID}`} class="movie">
  {#if imageLoading}
    <Loader
      scale=".7"
      absolute />
  {/if}
  <div style="background-image: url({movie.Poster})" class="poster" >
    {#if movie.Poster === 'N/A'}
      OMDb API<br />
      N/A
    {/if}
  </div>
  <div class="info">
    <div style="background-image: url({movie.Poster})" class="poster"></div>
    <div class="year">{movie.Year}</div>
    <div class="title">{movie.Title}</div>
  </div>
</a>

<style lang="scss">
  .movie {
    width: 200px;
    height: 200px * 3/2;
    margin: 10px;
    border-radius: 6px;
    text-decoration: none;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    &:hover {
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 6px solid $color--primary;
      }
    }
    .poster {
      width: 100%;
      height: 100%;
      background-color: $color--black-50;
      background-position: center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Oswald', sans-serif;
      color: $color--white-10;
      font-size: 20px;
      text-align: center;
      text-decoration: none;
    }
    .info {
      width: 100%;
      height: 66px;
      padding: 14px;
      box-sizing: border-box;
      overflow: hidden;
      position: absolute;
      bottom: 0;
      left: 0;
      .poster {
        position: absolute;
        bottom: 0;
        left: 0;
        transform: scale(2);
        filter: blur(5px);
        &::after {
          content: "";
          background-color: $color--black-50;
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
        }
      }
      .year {
        position: relative;
        color: $color--primary;
        font-size: 12px;
        text-align: left;
      }
      .title {
        font-family: 'Oswald', sans-serif;
        font-size: 15px;
        text-align: left;
        position: relative;
        color: $color--white;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
