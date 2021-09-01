<script>
  import Sortable from 'sortablejs';
  import { onMount } from 'svelte';
  import { cards } from '~/store/list';

  import Card from '~/components/Card.svelte';
  import CreateCard from '~/components/CreateCard.svelte';
  import ListTitle from '~/components/ListTitle.svelte';

  export let list;
  export let sortableLists;

  let sortableCards;
  let cardsEl;

  function disableSortable(event) {
    console.log(event.detail);
    sortableLists.option('disabled', event.detail); // for Lists
    sortableCards.option('disabled', event.detail); // for Cards
  }

  onMount(() => {
    // for Cards
    sortableCards = new Sortable(cardsEl, {
      group: 'My Cards',
      handle: '.card',
      delay: 50,
      animation: 100,
      forceFallback: true,
      onEnd(event) {
        //console.log(event);
        cards.reorder({
          fromListId: event.from.dataset.listId,
          toListId: event.to.dataset.listId,
          oldIndex: event.oldIndex,
          newIndex: event.newIndex
        });
      }
    });
  });
</script>

<div class="list">
  <div class="list__inner">
    <div class="list__heading">
      <ListTitle list={list} on:editMode={disableSortable} />
      <p>{list.cards.length} cards</p>
    </div>
    <div data-list-id={list.id} bind:this={cardsEl} class="list__cards">
      {#each list.cards as card (card.id)}
        <Card listId={list.id} card={card} on:editMode={disableSortable} />
      {/each}
    </div>
    <CreateCard listId={list.id} on:editMode={disableSortable} />
  </div>
</div>

<style lang="scss">
  .list {
    white-space: normal;
    font-size: 16px;
    word-break: break-all;
    display: inline-block;
    vertical-align: top;
    line-height: 20px;
    width: 290px;
    height: 100%;
    margin: 0 4px;
    /*border: 10px solid yellowgreen;*/
    /*box-sizing: border-box;*/
    user-select: none;
    :global(&.sortable-ghost) {
      opacity: .2;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        border-radius: 4px;
      }
    }
    :global(&.sortable-chosen) {
      cursor: move;
    }
    .list__inner {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      padding: 10px 8px;
      background: #ebecf0;
      border-radius: 4px;
      .list__heading {
        margin-bottom: 10px;
        p {
          font-size: 13px;
          color: #5e6c84;
          padding: 0 8px;
        }
      }
      .list__cards {
        overflow-x: hidden;
        overflow-y: auto;
        margin-bottom: 10px;
      }
    }
  }
</style>
