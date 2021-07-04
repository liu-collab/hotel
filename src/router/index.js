import Vue from 'vue'
import VueRouter from 'vue-router'
//加载进度条
import NProgress from 'nprogress'
import "nprogress/nprogress.css";

Vue.use(VueRouter)
const index = () => import('../views/index.vue')
const Login = () => import('../views/Login.vue')
const Home = () => import('../views/home/home.vue')
const HomePage = () => import('../views/homepage/HomePage.vue')
const Message = () => import('../views/message/Message.vue')
const Email = () => import('../views/email/Email.vue')
const Person = () => import('../views/user/person/Person.vue')
const Exit = () => import('../views/user/exit/Exit.vue')
const Modify = () => import('../views/user/modify/Modify.vue')
const error = () => import('../views/404error.vue')
const RoleList = () => import('../views/role//RoleList.vue')
const Admin = () => import('../views/admin/Admin.vue')
const RoomType = () => import('../views/room/RoomType.vue')
const Room = () => import('../views/room/Room.vue')
const Guest = () => import('../views/guest/list.vue')
const routes = [
  {//登录页
    path: '/',
    component: index
  },
  {//登录页
    path: '/login',
    component: Login
  },
  {
    //首页
    path: '/home',
    meta: { title: '首页' },
    component: Home,
    children: [
      {
        path: '',
        redirect: 'homepage'
      },
      {
        //主页面
        path: 'homepage',
        component: HomePage
      },
      {
        path: 'message',
        component: Message
      }, {
        path: 'email',
        component: Email
      }, {
        path: 'person',
        component: Person
      }, {
        path: 'exit',
        component: Exit
      }, {
        path: 'modify',
        component: Modify
      }, {
        path: 'rolelist',
        meta: { title: '角色管理' },
        component: RoleList
      }, {
        path: 'admin',
        meta: { title: '账号管理' },
        component: Admin
      }, {
        path: 'roomtype',
        meta: { title: '类型管理' },
        component: RoomType
      }, {
        path: 'room',
        meta: { title: '客房管理' },
        component: Room
      }, {
        path: 'guest',
        meta: { title: '顾客管理' },
        component: Guest
      }
    ]
  },
  {
    path: '*',
    component: error
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
}),
  router.afterEach(route => {
    //响应结束关闭进度条
    NProgress.done();
  })
export default router
