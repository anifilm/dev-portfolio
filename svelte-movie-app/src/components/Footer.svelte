<footer>
  <div>
    <a href="https://github.com/anifilm/webapp/tree/master/svelte/svelte_SPA/svelte-movie-app" target="_blank">GitHub Repo.</a>
  </div>
  <div>
    <a href="https://anifilm.github.io" target="_blank">@{new Date().getFullYear()} Anifilm</a>
  </div>
</footer>

<style lang="scss">
  footer {
    padding: 70px;
    text-align: center;
    a {
      color: $color--white-10;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
