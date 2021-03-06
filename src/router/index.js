import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Auth from '../components/auth/Auth.vue'
import Role from '../components/auth/Role.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login'},
  { path: '/login', component: Login},
  { 
    path: '/home', 
    component: Home,
    redirect: '/welcome', 
    children: [
      { path: '/welcome', component: Welcome},
      { path: '/user', component: User},
      { path: '/auth', component: Auth},
      { path: '/role', component: Role},
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // from: 代表从哪个路径跳转过来
  // next: 是一个函数，表示放行，next() 放行，next('/login') 强制跳转
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
