import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App) // https://css-tricks.com/what-does-the-h-stand-for-in-vues-render-method
});
