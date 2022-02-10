import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

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
    component: () => import(/* webpackChunkName: "Play" */ '../views/Play'),
    children: [
      {
        path: 'creategame',
        name: 'CreateGame',
        component: () => import(/* webpackChunkName: "CreateGame" */ '../views/Play/CreateGame')
      },
      {
        path: 'joingame',
        name: 'JoinGame',
        component: () => import(/* webpackChunkName: "JoinGame" */ '../views/Play/JoinGame')
      }
    ]
  },
  {
    path: '/room',
    name: 'Room',
    component: () => import(/* webpackChunkName: "Room" */ '../views/Room')
  },
  {
    path: '/populargame',
    name: 'PopularGame',
    component: () => import(/* webpackChunkName: "PopularGame" */ '../views/PopularGame')
  },
  {
    path: '/makegame',
    name: 'MakeGame',
    component: () => import(/* webpackChunkName: "MakeGame" */ '../views/MakeGame'),
    children: [
      {
        path: 'edit',
        name: 'Edit',
        component: () => import(/* webpackChunkName: "Edit" */ '../views/MakeGame/Edit')
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '../views/NotFound')
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
