import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import(/* webpackChunkName: "882cf9546db5" */ '../views/layout/index.vue')
const Home = () => import(/* webpackChunkName: "0394a6030e4b" */ '../views/home/index.vue')
const UserCenter = () => import(/* webpackChunkName: "25a57435eb81" */ '../views/userCenter/index.vue')
const Safety = () => import(/* webpackChunkName: "23023d6e49fe" */ '../views/userCenter/safety/safety.vue')
const Credential = () => import(/* webpackChunkName: "33023d6e49fe" */ '../views/credential/index.vue')


const routes = [
    { meta: { title: 'Console - Mobile' }, path: '/mobile', name: 'homeMobile', component: Home },
    {
        path: '/', component: Layout, children: [
            { meta: { title: '服务' }, path: '/', name: 'homePc', component: Home },
            { meta: { title: '个人中心' }, path: '/accountInfo', name: 'userCenter', component: UserCenter },
            { meta: { title: '个人中心' }, path: '/accountInfo/safety', name: 'safety', component: Safety },
            { meta: { title: '我的凭据' }, path: '/credential', name: 'credential', component: Credential },
        ]
    }
]

const router = createRouter({
  history: createWebHashHistory('/console/'),
  routes
})

export default router
