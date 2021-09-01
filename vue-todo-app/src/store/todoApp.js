import Vue from 'vue';
import lowdb from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import cryptoRandomString from 'crypto-random-string';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _assign from 'lodash/assign';
import _cloneDeep from 'lodash/cloneDeep';
import _forEachRight from 'lodash/forEachRight';

export default {
  namespaced: true,
  // Data
  state: () => ({
    db: null,
    todos: [],
    filter: 'all'
  }),
  // Computed
  getters: {
    filteredTodos(state) {
      switch (state.filter) {
        case 'active':
          return state.todos.filter(todo => !todo.done);
        case 'completed':
          return state.todos.filter(todo => todo.done);
        case 'all':
        default:
          return state.todos;
      }
    },
    activeCount(state) {
      return state.todos.filter(todo => !todo.done).length;
    },
    completedCount(state) {
      return state.todos.filter(todo => todo.done).length;
    },
    total(state) {
      return state.todos.length;
    }
  },
  // Methods (실제 값을 변경할 때, 비동기 불가)
  mutations: {
    assignDB(state, db) {
      state.db = db;
    },
    createDB(state, newTodo) {
      state.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write(); // lowdb
    },
    updateDB(state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write();
    },
    deleteDB(state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write();
    },
    assignTodos(state, todos) {
      //state.db
      //  .get('todos')
      //  .remove({ id: todos.id })
      //  .write();
      state.todos = todos;
    },
    pushTodo(state, newTodo) {
      state.todos.push(newTodo);
    },
    assignTodo(state, { foundTodo, value }) {
      _assign(foundTodo, value);
    },
    updateTodo(state, { todo, key, value }) {
      todo[key] = value;
    },
    deleteTodo(state, foundIndex) {
      //Vue.delete(state.todos, foundIndex);
      state.todos.splice(foundIndex, 1);
    },
    updateFilter(state, filter) {
      state.filter = filter;
    }
  },
  // Methods (일반 로직, 비동기 가능)
  actions: {
    initDB({ state, commit }) {
      const adapter = new LocalStorage('todo-app'); // DB
      //state.db = lowdb(adapter);
      commit('assignDB', lowdb(adapter));

      console.log(state.db);
      const hasTodos = state.db.has('todos').value();

      if (hasTodos) {
        // 깊은 배열 복사, 'this.todos'를 수정할 때 'this.db.getState().todos'를 직접 참조하는 문제를 방지할 수 있습니다.
        //state.todos = _cloneDeep(state.db.getState().todos);
        commit('assignTodos', _cloneDeep(state.db.getState().todos));
      } else {
        // Local DB 초기화
        state.db
          .defaults({
            todos: [] // Collection
          })
          .write();
      }
    },
    createTodo({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      };

      // Local DB에 내용 추가
      commit('createDB', newTodo);

      // 로컬(local)에 반영
      commit('pushTodo', newTodo);
    },
    updateTodo({ state, commit }, { todo, value }) {
      //console.log('Update todo!', value);
      commit('updateDB', { todo, value });

      // 로컬(local)에 반영, Lodash 라이브러리 활용
      const foundTodo = _find(state.todos, { id: todo.id });
      //_assign(foundTodo, value);
      commit('assignTodo', { foundTodo, value });
    },
    deleteTodo({ state, commit }, todo) {
      //console.log('Delete todo!', todo);
      commit('deleteDB', todo);

      // 로컬(local)에 반영, Lodash 라이브러리 활용
      const foundIndex = _findIndex(state.todos, { id: todo.id });
      //Vue.delete(state.todos, foundIndex);
      commit('deleteTodo', foundIndex);
    },
    completeAll({ state, commit }, checked) {
      const newTodos = state.db
        .get('todos')
        .forEach(todo => {
          //todo.done = checked;
          commit('updateTodo', {
            todo,
            key: 'done',
            value: checked
          });
        })
        .write(); // 수정된 'todos' 배열을 저장합니다.

      // 로컬(local)에 반영
      //store.todos = _cloneDeep(newTodos);
      commit('assignTodos', _cloneDeep(newTodos));
    },
    clearCompleted({ state, commit, dispatch }) {
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          //state.deleteTodo(todo);
          dispatch('deleteTodo', todo);
        }
      });
    }
  }
};
