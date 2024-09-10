import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('../views/login/index.vue')
const Home = () => import('../views/home/index.vue')
const Layout = () => import('../views/usercenter/layout/index.vue')
const AccountInfo = () => import('../views/usercenter/info/index.vue')
const routes = [
    { path: '/login', meta: { title: '登录' },  name: 'login', component: Login },
    { path: '/', meta: { title: '首页' }, name: 'BasicIndex', component: Home },
    {
        path: '/usercenter', meta: { title: '账号中心' }, component: Layout, children: [
            { meta: { title: '服务管理' }, path: '/accountInfo', name: 'AccountInfo', component: AccountInfo },
        ]
    }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
