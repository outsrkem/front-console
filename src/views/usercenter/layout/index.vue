<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="200px">
      <app-aside class="aside-menu" />
    </el-aside>
    <el-container>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './aside'
export default {
    name: 'LayoutIndex',
    components: {
        AppAside
    },
    props: {},
    data() {
        return {
            username: '账户名()', // 显示账户名
            breadcrumb: ['a', 'b', 'c'], // 面包屑导航
        }
    },
    methods: {
    },
}
</script>

<style scoped lang="less">
    .layout-container {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
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
</style>
