<script>
  import { onDestroy, tick, createEventDispatcher } from 'svelte';
  import { cards } from '~/store/list';
  import { autoFocusout } from '~/actions/autoFocusout';

  export let listId;
  export let card;

  let isEditMode = false;
  let title;
  let textareaEl;

  const dispatch = createEventDispatcher();

  function saveCard() {
    if (title.trim()) {
      cards.edit({
        listId: listId,
        cardId: card.id,
        title: title.trim()
      });
    }
    offEditMode();
  }
  function removeCard() {
    cards.remove({
      listId: listId,
      cardId: card.id
    });
    offEditMode();
  }
  async function onEditMode() {
    isEditMode = true;
    title = card.title;
    dispatch('editMode', true);
    await tick();
    textareaEl && textareaEl.focus();
  }
  function offEditMode() {
    isEditMode = false;
    dispatch('editMode', false);
  }

  onDestroy(() => {
    offEditMode();
  })
</script>

<div class="card" data-card-id={card.id}>
  {#if isEditMode}
    <div use:autoFocusout={offEditMode} class="edit-mode">
      <textarea
        bind:value={title}
        bind:this={textareaEl}
        placeholder="Enter a title for this card..."
        on:keydown={event => {
          console.log(event.key)
          event.key === 'Enter' && saveCard()
          event.key === 'Escape' && offEditMode()
          event.key === 'Esc' && offEditMode() // for Edge Browser
        }}
      ></textarea>
      <div class="actions">
        <div class="btn success" on:click={saveCard}>Save</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
        <div class="btn danger" on:click={removeCard}>Delete Card</div>
      </div>
    </div>
  {:else}
    <div class="title">
      {card.title}
      <div class="btn small" on:click={onEditMode}>Edit</div>
    </div>
  {/if}
</div>

<style lang="scss">
  .card {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 1px;
    }
    :global(&.sortable-ghost) {
      opacity: .1;
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
    .title {
      position: relative;
      border-radius: 4px;
      background: #fff;
      padding: 6px 8px;
      box-shadow: 0 1px 0 rgba(9, 30, 66, .25);
      line-height: 30px;
      user-select: none;
      &:hover {
        background: #f5f5f5;
      }
      .btn {
        position: absolute;
        top: 10px;
        right: 8px;
        display: none;
      }
      &:hover .btn {
        display: block;
      }
    }
  }
</style>
