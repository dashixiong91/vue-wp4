
const routes=[
  {
    path:'/',
    redirect:'home'
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
]

export default routes;