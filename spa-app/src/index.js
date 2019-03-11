import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './routes';
import './styles/main.scss';

Vue.use(VueRouter);

const router=new VueRouter({
  routes,
});

new Vue({
  el:'#app',
  router,
  render:createElement=>createElement(App)
});
