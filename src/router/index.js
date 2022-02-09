import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Play from '../views/Play'
import PopularGame from '../views/PopularGame'
import MakeGame from '../views/MakeGame'
import Edit from '../views/MakeGame/Edit'
import NotFound from '../views/NotFound'

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
    component: Play,
    children: [
      {
        path: 'creategame',
        name: 'CreateGame',
        component: () => import(/* webpackChunkName: "CreateGame" */ '../views/Play/CreateGame.vue')
      },
      {
        path: 'joingame',
        name: 'JoinGame',
        component: () => import(/* webpackChunkName: "JoinGame" */ '../views/Play/JoinGame.vue')
      },
      {
        path: 'room',
        name: 'Room',
        component: () => import(/* webpackChunkName: "Room" */ '../views/Play/Room.vue')
      }
    ]
  },
  {
    path: '/populargame',
    name: 'PopularGame',
    component: PopularGame
  },
  {
    path: '/makegame',
    name: 'MakeGame',
    component: MakeGame,
    children: [
      {
        path: 'edit',
        name: 'Edit',
        component: Edit
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
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
