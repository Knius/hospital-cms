import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const articleList = () => import(/* webpackChunkName: "articleEdit" */ '../pages/publishSys/articleList')
const articleEdit = () => import(/* webpackChunkName: "articleEdit" */ '../pages/publishSys/articleEdit')
const msgManagement = () => import(/* webpackChunkName: "msgManagement" */ '../pages/msgSys/msgManagement')
const login = () => import(/* webpackChunkName: "login" */ '../pages/login')
const main = () => import(/* webpackChunkName: "main" */ '../pages/main')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/main',
    name: 'main',
    component: main,
    children:[
      {
        path: '',
        redirect : '/publishSys/articleList'
      },
      {
        path: '/publishSys/articleList',
        name: 'articleList',
        component: articleList
      },
      {
        path: '/publishSys/articleEdit',
        name: 'articleEdit',
        component: articleEdit
      },
      {
        path: '/msgSys/msgManagement',
        name: 'msgManagement',
        component: msgManagement
      }
    ]
  },
]

export default new Router({
  linkActiveClass: 'is-active',   //路由被激活时添加此类名
  routes
}) 