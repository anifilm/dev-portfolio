<script>
  import { tick } from 'svelte';
  import { todos, saveStorage } from '~/store';

  export let todo;

  let isEditMode = false;
  let title = '';
  let inputEl;

  async function onEditMode() {
    isEditMode = true;
    title = todo.title;
    await tick();
    inputEl && inputEl.focus();
  }
  function offEditMode() {
    isEditMode = false;
  }
  function updateTodo() {
    if (!title.trim()) {
      offEdit();
      return;
    }
    todo.title = title.trim();
    saveStorage();
    offEditMode();
  }
  function deleteTodo() {
    $todos = $todos.filter((t) => {
      return t.id !== todo.id;
    });
    saveStorage();
  }
</script>

<div class="todo">
  {#if isEditMode}
    <div class="edit-mode">
      <input
        type="text"
        class="form-control"
        bind:value={title}
        bind:this={inputEl}
        on:keyup={(event) => {
          event.key === 'Enter' && updateTodo();
          event.key === 'Escape' && offEditMode();
          event.key === 'Esc' && offEditMode(); // for Edge Browser
        }}
      />
      <button class="btn btn-primary" on:click={updateTodo}>OK</button>
      <button class="btn btn-secondary" on:click={offEditMode}>Cancel</button>
    </div>
  {:else}
    <div class="normal-mode">
      <div class="title">{todo.title}</div>
      <button class="btn btn-secondary" on:click={onEditMode}>Edit</button>
      <button class="btn btn-danger" on:click={deleteTodo}>delete</button>
    </div>
  {/if}
</div>

<style lang="scss">
  .todo {
    padding: 10px 14px;
    border-radius: 6px;
    &:hover {
      background-color: $gray-100;
    }
    .edit-mode, .normal-mode {
      display: flex;
    }
    .title {
      flex-grow: 1;
      display: flex;
      align-items: center;
      font-size: 18px;
    }
    .btn {
      flex-shrink: 0;
      margin-left: 10px;
    }
  }
</style>
