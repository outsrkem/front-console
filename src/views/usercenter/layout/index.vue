<template>
    <div class="header-container" style="width: 100%;">
        <div class="header-button">
            <span>欢迎您，{{ username }}</span>
            <button  type="button" @click="onUserCenter">个人中心</button>
            <button  type="button" @click="onToConsole">控制台</button>
            <button  type="button" @click="Logout">退出</button>
        </div>
    </div>
    <div>
        <el-container class="layout-container">
            <el-aside class="aside" width="200px">
                <app-aside class="aside-menu"/>
            </el-aside>
            <el-main class="main">
                <!-- 子路由出口 -->
                <router-view />
            </el-main>
        </el-container>
    </div>
</template>
<script>
import AppAside from './aside'
import { logout } from '@/api/index.js'
export default {
    name: 'LayoutIndex',
    components: {
        AppAside
    },
    props: {},
    data() {
        return {
            username: '', // 显示账户名
            breadcrumb: ['a', 'b', 'c'], // 面包屑导航
        }
    },
    methods: {
        onUserCenter() {
            let wl = window.location
            let accountInfoUrl = wl.protocol + '//' + wl.host + '/#/accountInfo'
            window.location.assign(accountInfoUrl);
        },
        onToConsole() {
            let wl = window.location
            let accountInfoUrl = wl.protocol + '//' + wl.host
            window.location.assign(accountInfoUrl);
        },
        LoadLogOut: async function () {
            await logout().then(() => {
                window.sessionStorage.removeItem('active-path')
                this.$cookies.remove('session');
                this.$router.push('/login')
            })
        },
        Logout() {
            this.$confirm('确认退出吗？', '退出提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
                this.LoadLogOut()
            }).catch(() => {})
        },
    },
}
</script>

<style scoped lang="less">
    .layout-container {
        // position: fixed;
        left: 0;
        right: 0;
        // top: 0;
        bottom: 0;
        height: 100%;
    }
    .aside {
        background-color: #d3dce6;
        .aside-menu {
            height: 100%;
        }
    }
    .main {
        background-color: #e9eef3;
        padding-left: 20px;
        padding-top: 20px;
    }
    .header-container {
        height: 38px;
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */
        // border-bottom: 1px solid #adb0b8;
        background-color: #d3dce6;
        .header-button button {
            margin-left: 20px;
            background: none; /* 移除背景 */
            border: none; /* 移除边框 */
            padding: 0; /* 移除内边距 */
            font-family: inherit; /* 继承字体 */
            font-size: inherit; /* 继承字体大小 */
            color: inherit; /* 继承文字颜色 */
            cursor: pointer; /* 鼠标悬停时显示指针 */
            outline: none; /* 移除点击时的轮廓线 */
        }
    }
</style>
