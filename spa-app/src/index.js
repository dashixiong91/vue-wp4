import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './routes';
import './styles/main.scss';
import './styles/main.css';

Vue.use(VueRouter);

const router=new VueRouter({
  base:ROUTER_PREFIX,
  mode:'history',
  routes,
});
new Vue({
  el:'#app',
  router,
  render:createElement=>createElement(App)
});
