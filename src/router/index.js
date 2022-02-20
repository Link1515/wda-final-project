import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '易桌遊'
    },
    component: Home
  },
  {
    path: '/play',
    name: 'Play',
    meta: {
      title: '易桌遊 | 立即開始'
    },
    component: () => import(/* webpackChunkName: "Play" */ '../views/Play'),
    children: [
      {
        path: 'creategame',
        name: 'CreateGame',
        meta: {
          title: '易桌遊 | 創建遊戲'
        },
        component: () => import(/* webpackChunkName: "CreateGame" */ '../views/Play/CreateGame')
      },
      {
        path: 'joingame',
        name: 'JoinGame',
        meta: {
          title: '易桌遊 | 加入遊戲'
        },
        component: () => import(/* webpackChunkName: "JoinGame" */ '../views/Play/JoinGame')
      }
    ]
  },
  {
    path: '/room',
    name: 'Room',
    meta: {
      title: '易桌遊 | 遊戲間'
    },
    component: () => import(/* webpackChunkName: "Room" */ '../views/Room'),
    children: [
      {
        path: 'start',
        name: 'Start',
        meta: {
          title: '易桌遊 | 遊戲間'
        },
        component: () => import(/* webpackChunkName: "Start" */ '../views/Room/Start')
      }
    ]
  },
  {
    path: '/populargame',
    name: 'PopularGame',
    meta: {
      title: '易桌遊 | 熱門遊戲'
    },
    component: () => import(/* webpackChunkName: "PopularGame" */ '../views/PopularGame')
  },
  {
    path: '/makegame',
    name: 'MakeGame',
    meta: {
      title: '易桌遊 | 自製遊戲',
      mustLogin: true
    },
    component: () => import(/* webpackChunkName: "MakeGame" */ '../views/MakeGame'),
    children: [
      {
        path: 'edit',
        name: 'Edit',
        meta: {
          title: '易桌遊 | 自製遊戲',
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
          title: '易桌遊 | 會員資料',
          mustLogin: true
        },
        component: () => import(/* webpackChunkName: "EditInfo" */ '../views/UserCenter/EditInfo')
      },
      {
        path: 'editpassword',
        name: 'EditPassword',
        meta: {
          title: '易桌遊 | 修改密碼',
          mustLogin: true
        },
        component: () => import(/* webpackChunkName: "EditPassword" */ '../views/UserCenter/EditPassword')
      },
      {
        path: 'bugreport',
        name: 'BugReport',
        meta: {
          title: '易桌遊 | 錯誤回報',
          mustLogin: true
        },
        component: () => import(/* webpackChunkName: "BugReport" */ '../views/UserCenter/BugReport')
      },
      {
        path: 'manageuser',
        name: 'ManageUser',
        meta: {
          title: '易桌遊 | 會員管理',
          mustLogin: true,
          admin: true
        },
        component: () => import(/* webpackChunkName: "ManageUser" */ '../views/UserCenter/ManageUser')
      },
      {
        path: 'managegame',
        name: 'ManageGame',
        meta: {
          title: '易桌遊 | 桌遊管理',
          mustLogin: true,
          admin: true
        },
        component: () => import(/* webpackChunkName: "ManageGame" */ '../views/UserCenter/ManageGame')
      },
      {
        path: 'reportreview',
        name: 'ReportReview',
        meta: {
          title: '易桌遊 | 會員回報',
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

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
