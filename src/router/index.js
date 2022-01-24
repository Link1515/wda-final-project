import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Play from '../views/Play'
import PopularGame from '../views/PopularGame'
import MakeGame from '../views/MakeGame'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/play',
    name: 'Play',
    component: Play
  },
  {
    path: '/populargame',
    name: 'PopularGame',
    component: PopularGame
  },
  {
    path: '/makegame',
    name: 'MakeGame',
    component: MakeGame
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
