<script>
  import Sortable from 'sortablejs';
  import { onMount } from 'svelte';
  import { lists } from '~/store/list';

  import List from './List.svelte';
  import CreateList from './CreateList.svelte';

  let listsEl;
  let sortableLists;

  // lists 스토어의 값($lists)이 변경되면 아래의 반응성 구문이 실행된다.
  $: {
    console.log($lists);
  }

  onMount(() => {
    // for Lists
    sortableLists = new Sortable(listsEl, {
      group: 'My Lists',
      handle: '.list',
      delay: 50,
      animation: 100,
      forceFallback: true,
      onEnd(event) {
        //console.log(event);
        lists.reorder({
          oldIndex: event.oldIndex,
          newIndex: event.newIndex
        });
      }
    });
  });
</script>

<div class="list-container">
  <div bind:this={listsEl} class="lists">
    <!-- <div class="list"></div> -->
    {#each $lists as list (list.id)}
      <List list={list} sortableLists={sortableLists} />
    {/each}
  </div>
  <!--<div class="create-list"></div>-->
  <CreateList />
</div>

<style lang="scss">
  .list-container {
    width: 100vw;
    height: calc(100vh - 40px);
    padding: 30px;
    /*border: 10px solid red;*/
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    font-size: 0;
    .lists {
      display: inline-block;
      height: 100%;
      white-space: nowrap;
      font-size: 0;
      /*border: 10px solid blue;*/
      /*box-sizing: border-box;*/
    }
  }
</style>
