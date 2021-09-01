<script>
  import { tick } from 'svelte';
  import { lists } from '~/store/list';
  import { autoFocusout } from '~/actions/autoFocusout';

  let isEditMode = false;
  let title = '';
  let textareaEl;

  function addList() {
    if (title.trim()) {
      lists.add({
        title: title.trim()
      });
    }
    offEditMode();
  }
  async function onEditMode() {
    isEditMode = true;
    await tick();
    textareaEl && textareaEl.focus();
  }
  function offEditMode() {
    title = '';
    isEditMode = false;
  }
</script>

<div class="create-list">
  {#if isEditMode}
    <div use:autoFocusout={offEditMode} class="edit-mode">
      <textarea
        bind:value={title}
        bind:this={textareaEl}
        placeholder="Enter a title for this list..."
        on:keydown={(event) => {
          event.key === 'Enter' && addList();
          event.key === 'Escape' && offEditMode();
          event.key === 'Esc' && offEditMode(); // for Edge Browser
        }}
      ></textarea>
      <div class="actions">
        <div class="btn success" on:click={addList}>Add List</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
      </div>
    </div>
  {:else}
    <div class="add-another-list" on:click={onEditMode}>
      + Add another list
    </div>
  {/if}
</div>

<style lang="scss">
  .create-list {
    white-space: normal;
    font-size: 16px;
    display: inline-block;
    width: 290px;
    padding: 10px 8px;
    /*border: 10px solid yellowgreen;*/
    box-sizing: border-box;
    vertical-align: top;
    background: rgba(#ebecf0, .6);
    border-radius: 4px;
    margin: 0 4px;
    line-height: 20px;
    cursor: pointer;
    transition: .2s;
    &:hover {
      background: #ebecf0;
    }
  }
</style>
