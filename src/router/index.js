import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('../views/login/index.vue')
const Home = () => import('../views/home/index.vue')

const routes = [
    { path: '/login', meta: { title: '登录' },  name: 'login', component: Login },
    { path: '/', meta: { title: '首页' }, name: 'BasicIndex', component: Home }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
