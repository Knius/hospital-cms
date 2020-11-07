import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const articleList = () => import(/* webpackChunkName: "articleList" */ '../pages/publishSys/articleList')
const articleEdit = () => import(/* webpackChunkName: "articleEdit" */ '../pages/publishSys/articleEdit')
const departmentList = () => import(/* webpackChunkName: "departmentList" */ '../pages/departmentSys/departmentList')
const departmentEdit = () => import(/* webpackChunkName: "departmentEdit" */ '../pages/departmentSys/departmentEdit')
const doctorList = () => import(/* webpackChunkName: "doctorList" */ '../pages/doctorSys/doctorList')
const doctorEdit = () => import(/* webpackChunkName: "doctorEdit" */ '../pages/doctorSys/doctorEdit')
const imgList = () => import(/* webpackChunkName: "imgList" */ '../pages/imgSys/imgList')
const doctorTimeList = () => import(/* webpackChunkName: "doctorTimeList" */ '../pages/doctorTime/doctorTimeList')
const friendLinkList = () => import(/* webpackChunkName: "friendLinkList" */ '../pages/friendLinkSys/friendLinkList')
const userList = () => import(/* webpackChunkName: "userList" */ '../pages/userSys/userList')
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
        path: '/departmentSys/departmentList',
        name: 'departmentList',
        component: departmentList
      },
      {
        path: '/departmentSys/departmentEdit',
        name: 'departmentEdit',
        component: departmentEdit
      },
      {
        path: '/imgSys/imgList',
        name: 'imgList',
        component: imgList
      },
      {
        path: '/userSys/userList',
        name: 'userList',
        component: userList
      },
      {
        path: '/doctorSys/doctorList',
        name: 'doctorList',
        component: doctorList
      },
      {
        path: '/doctorSys/doctorEdit',
        name: 'doctorEdit',
        component: doctorEdit
      },
      {
        path: '/doctorTime/doctorTimeList',
        name: 'doctorTimeList',
        component: doctorTimeList
      },
      {
        path: '/friendLink/friendLinkList',
        name: 'friendLinkList',
        component: friendLinkList
      }
    ]
  },
]

export default new Router({
  linkActiveClass: 'is-active',   //路由被激活时添加此类名
  routes
}) 