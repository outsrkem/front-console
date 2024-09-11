import { createRouter, createWebHashHistory } from 'vue-router'

const Home = () => import('../views/home/index.vue')
const Layout = () => import('../views/usercenter/layout/index.vue')
const AccountInfo = () => import('../views/usercenter/info/index.vue')

const routes = [
    { path: '/', meta: { title: '首页' }, name: 'BasicIndex', component: Home },
    {
        path: '/usercenter', meta: { title: '账号中心' }, component: Layout, children: [
            { meta: { title: '服务管理' }, path: '/accountInfo', name: 'AccountInfo', component: AccountInfo },
        ]
    }
]

const router = createRouter({
  history: createWebHashHistory('/console/'),
  routes
})

export default router
