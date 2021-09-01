<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <!-- FILTERS -->
      <div class="filters">
        <router-link to="all" tag="button">
          모든 항목 ({{ total }})
        </router-link>
        <router-link to="active" tag="button">
          해야 할 항목 ({{ activeCount }})
        </router-link>
        <router-link to="completed" tag="button">
          완료된 항목 ({{ completedCount }})
        </router-link>
      </div>

      <!-- ACTIONS -->
      <div class="actions clearfix">
        <label class="float--left">
          <input v-model="allDone" type="checkbox" />
          <span class="icon"><i class="material-icons">done_all</i></span>
        </label>
        <div class="float--right clearfix">
          <button class="btn float--left" @click="scrollToTop">
            <i class="material-icons">expand_less</i>
          </button>
          <button class="btn float--left" @click="scrollToBottom">
            <i class="material-icons">expand_more</i>
          </button>
          <!-- 완료된 항목 삭제 -->
          <button class="btn btn--danger float--left" @click="clearCompleted">
            <i class="material-icons">delete_sweep</i>
          </button>
        </div>
      </div>
    </div>

    <!-- LIST -->
    <div class="todo-app__list">
      <todo-item v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
    </div>

    <!-- INSERT -->
    <todo-creator class="todo-app__creator" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import scrollTo from 'scroll-to';

import TodoCreator from '~/components/TodoCeator';
import TodoItem from '~/components/TodoItem';

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  computed: {
    // Helpers
    ...mapState('todoApp', [
      'db',
      'todos'
    ]),
    ...mapGetters('todoApp', [
      'filteredTodos',
      'total',
      'activeCount',
      'completedCount'
    ]),
    //todos() {
    //  return this.$store.state.todoApp.todos;
    //},
    //total() {
    //  return this.$store.getters.todoApp.total;
    //},
    //activeCount() {
    //  return this.$store.getters.todoApp.activeCount;
    //},
    allDone: {
      get() {
        // 전체 항목 개수와 완료된 항목 개수가 일치하고 항목 개수가 1개 이상인 경우
        return this.total === this.completedCount && this.total > 0;
      },
      set(checked) {
        this.completeAll(checked);
      }
    }
  },
  methods: {
    ...mapMutations('todoApp', [
      'updateFilter'
    ]),
    ...mapActions('todoApp', [
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    //initDB() {
    //  this.$store.dispatch('todoApp/initDB');
    //},
    //updateTodo() {
    //  this.$store.commit('todoApp/updateTodo');
    //},
    scrollToTop() {
      scrollTo(0, 0);
    },
    scrollToBottom() {
      // TODO: 개선 필요
      scrollTo(0, document.body.scrollHeight);
    }
  },
  watch: {
    $route() {
      //this.$store.commit('todoApp/updateFilter', this.$route.params.id);
      this.updateFilter(this.$route.params.id);
    }
  },
  created() {
    this.initDB();
  }
};
</script>

<style lang="scss">
@import '~scss/style';

.filters button.router-link-active {
  background: royalblue;
  color: white;
}
</style>
