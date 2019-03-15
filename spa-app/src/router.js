import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: 'home',
  },
  {
    name: 'home',
    path: '/home',
    component: () => import(/* webpackChunkName: 'home' */'./pages/home/index.vue'),
  },
  {
    name: 'about',
    path: '/about',
    component: () => import(/* webpackChunkName: 'about' */'./pages/about/index.vue'),
  },
  {
    name: '404',
    path: '*',
    component: () => import(/* webpackChunkName: '404' */'./pages/error/404.vue'),
  },
];

export function createRouter() {
  return new VueRouter({
    base: ROUTER_PREFIX,
    mode: 'history',
    routes,
  });
}
