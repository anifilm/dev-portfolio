<script>
  import { searchMovies } from '~/store/movie';
  import _upperFirst from 'lodash/upperFirst';

  const types = ['movie', 'series', 'episode'];
  const years = [];
  for (let y = new Date().getFullYear(); y >= 1985; y -= 1) {
    years.push(y);
  }
  const numbers = [10, 20, 30];

  const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  let title = '';
  let type = 'movie';
  let year = '';
  let number = 10;

  function apply() {
    if (korean.test(title.trim())) {
      alert('한글 검색은 지원하지 않습니다.');
      title = '';
      return;
    }
    if (!title.trim()) {
      title = '';
      return;
    }
    searchMovies({
      title: title.trim(),
      type: type,
      year: year,
      number: number
    });
  }
</script>

<div class="search">
  <div class="text-field">
    <input
      type="text"
      bind:value={title}
      placeholder="Search for Movies, Series & more"
      on:keydown={(event) => {
        event.key === 'Enter' && apply();
      }}
    />
  </div>

  <div class="select">
    <select bind:value={type}>
      {#each types as t (t)}
        <option value={t}>{_upperFirst(t)}</option>
      {/each}
    </select>
  </div>

  <div class="select">
    <select bind:value={year}>
      <option value="">All years</option>
      {#each years as y (y)}
        <option>{y}</option>
      {/each}
    </select>
  </div>

  <div class="select">
    <select bind:value={number}>
      {#each numbers as n (n)}
        <option>{n}</option>
      {/each}
    </select>
  </div>

  <button class="btn" on:click={apply}>Apply</button>
</div>

<style lang="scss">
  .search {
    display: grid;
    grid-template-columns: 1fr repeat(4, 120px);
    grid-gap: 10px;
    @media #{$tablet} {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 50px);
    }
    @media #{$mobile} {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 50px);
    }
    .text-field {
      display: inline-block;
      height: 50px;
      @media #{$tablet} {
        grid-column: 1 / -1;
      }
      input {
        width: 100%;
        height: 100%;
        background-color: $color--area;
        outline: none;
        border: none;
        padding: 0 20px;
        box-sizing: border-box;
        font-size: 14px;
        color: $color--white-60;
        border-radius: 4px;
        &::placeholder {
          color: $color--white-30;
        }
      }
    }
    .select {
      height: 50px;
      position: relative;
      select {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        padding: 0 32px 0 20px;
        box-sizing: border-box;
        font-size: 14px;
        color: $color--white-60;
        border-radius: 4px;
        background-color: $color--area;
        cursor: pointer;
        appearance: none;
      }
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 15px;
        width: 0;
        height: 0;
        margin-top: -1px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #555;
      }
    }
    .btn {
      height: 50px;
      padding: 0 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      background-color: $color--primary;
      font-weight: 700;
      color: $color--black;
      outline: none;
      transition: .4s;
      @media #{$mobile} {
        grid-column: 1 / -1;
      }
      &:hover {
        background-color: darken($color--primary, 10%);
      }
    }
  }
</style>
