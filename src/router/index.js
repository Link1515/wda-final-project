import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
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
    meta: {
      mustLogin: true
    },
    component: () => import(/* webpackChunkName: "MakeGame" */ '../views/MakeGame'),
    children: [
      {
        path: 'edit',
        name: 'Edit',
        meta: {
          mustLogin: true
        },
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
        meta: {
          mustLogin: true
        },
        component: () => import(/* webpackChunkName: "EditInfo" */ '../views/UserCenter/EditInfo')
      },
      {
        path: 'editpassword',
        name: 'EditPassword',
        meta: {
          mustLogin: true
        },
        component: () => import(/* webpackChunkName: "EditPassword" */ '../views/UserCenter/EditPassword')
      },
      {
        path: 'bugreport',
        name: 'BugReport',
        meta: {
          mustLogin: true
        },
        component: () => import(/* webpackChunkName: "BugReport" */ '../views/UserCenter/BugReport')
      },
      {
        path: 'manageuser',
        name: 'ManageUser',
        meta: {
          mustLogin: true,
          admin: true
        },
        component: () => import(/* webpackChunkName: "ManageUser" */ '../views/UserCenter/ManageUser')
      },
      {
        path: 'managegame',
        name: 'ManageGame',
        meta: {
          mustLogin: true,
          admin: true
        },
        component: () => import(/* webpackChunkName: "ManageGame" */ '../views/UserCenter/ManageGame')
      },
      {
        path: 'reportreview',
        name: 'ReportReview',
        meta: {
          mustLogin: true,
          admin: true
        },
        component: () => import(/* webpackChunkName: "ReportReview" */ '../views/UserCenter/ReportReview')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.mustLogin && !store.getters['user/userInfo'].isLogin) {
    next('/?login=0')
    return
  } else if (to.meta.admin && !store.getters['user/userInfo'].isAdmin) {
    next('/')
    return
  }
  next()
})

export default router
