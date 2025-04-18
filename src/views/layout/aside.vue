<template>
    <div class="el-aside">
        <p style="text-align: center">控制台</p>
        <el-menu :default-active="activePath" unique-opened :collapse="isCollapse">
            <el-menu-item index="/" @click="OnSwitchRoutes('/')">
                <el-icon><Position /></el-icon>
                <template #title><span>服务导航</span></template>
            </el-menu-item>
            <el-menu-item index="/accountInfo" @click="OnSwitchRoutes('/accountInfo')">
                <el-icon><User /></el-icon>
                <template #title><span>个人信息</span></template>
            </el-menu-item>
            <el-menu-item index="/credential" @click="OnSwitchRoutes('/credential')">
                <el-icon><Document /></el-icon>
                <template #title><span>我的凭据</span></template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
import { saveNavPath } from "@/utils/common.js";
export default {
    name: "AppAside",
    components: {},
    props: {},
    data() {
        return {
            activePath: "",
            menusList: [],
            isCollapse: false,
        };
    },
    computed: {},
    watch: {},
    created() {
        this.activePath = window.sessionStorage.getItem("active-path") || "/";
        this.$globalBus.on("updateActivePath", (data) => {
            this.activePath = data;
        });
    },
    methods: {
        saveActivePath(activePath) {
            this.activePath = activePath;
            saveNavPath(activePath);
        },
        OnSwitchRoutes(activePath) {
            this.saveActivePath(activePath);
            this.$router.push({ path: activePath });
        },
        OnClose() {
            if (this.isCollapse) {
                this.isCollapse = false;
            } else {
                this.isCollapse = true;
            }
        },
    },
};
</script>

<style scoped lang="less">
.el-aside {
    /* 处理菜单右边的阴影 */
    background-color: #ffffff;
    .el-menu {
        border-right: none;
    }
}
</style>
