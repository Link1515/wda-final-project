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
    component: () => import(/* webpackChunkName: "Room" */ '../views/Room'),
    children: [
      {
        path: 'start',
        name: 'Start',
        component: () => import(/* webpackChunkName: "Start" */ '../views/Room/Start')
      }
    ]
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
    path: '/usercenter',
    name: 'UserCenter',
    redirect: '/usercenter/editinfo',
    component: () => import(/* webpackChunkName: "UserCenter" */ '../views/UserCenter'),
    children: [
      {
        path: 'editinfo',
        name: 'EditInfo',
        component: () => import(/* webpackChunkName: "EditInfo" */ '../views/UserCenter/EditInfo')
      },
      {
        path: 'editpassword',
        name: 'EditPassword',
        component: () => import(/* webpackChunkName: "EditPassword" */ '../views/UserCenter/EditPassword')
      },
      {
        path: 'bugreport',
        name: 'BugReport',
        component: () => import(/* webpackChunkName: "BugReport" */ '../views/UserCenter/BugReport')
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '../views/NotFound')
  }
]

const router = new VueRouter({
  routes
})

export default router
