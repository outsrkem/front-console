import { createRouter, createWebHashHistory } from "vue-router";
import { isMobile } from "../utils/device";

const Layout = () => import(/* webpackChunkName: "882cf9546db5" */ "../views/layout/index.vue");
const Home = () => import(/* webpackChunkName: "0394a6030e4b" */ "../views/home/index.vue");
const UserCenter = () => import(/* webpackChunkName: "25a57435eb81" */ "../views/userCenter/index.vue");
const Safety = () => import(/* webpackChunkName: "23023d6e49fe" */ "../views/userCenter/safety/safety.vue");
const Credential = () => import(/* webpackChunkName: "33023d6e49fe" */ "../views/credential/index.vue");

const MobileLayout = () => import("../mobile/layout/index.vue");
const MobileHome = () => import("../mobile/home/index.vue");

// 动态导入组件（根据设备类型）
const loadComponent = (pcComponent, mobileComponent) => {
    return isMobile() ? mobileComponent : pcComponent;
};

const routes = [
    {
        path: "/",
        component: loadComponent(Layout, MobileLayout),
        children: [
            { meta: { title: "我的服务" }, path: "/", name: "homeIndex", component: loadComponent(Home, MobileHome) },
            { meta: { title: "个人中心" }, path: "/accountInfo", name: "userCenter", component: UserCenter },
            { meta: { title: "个人中心" }, path: "/accountInfo/safety", name: "safety", component: Safety },
            { meta: { title: "我的凭据" }, path: "/credential", name: "credential", component: Credential },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory("/console/"),
    routes,
});

export default router;
