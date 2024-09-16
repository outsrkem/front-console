<template>
    <div class="el-aside">
        <div style="padding-left: 20px; padding-right: 20px; margin-bottom: 20px; margin-top: 20px; text-align: center">
            <h4>控制台</h4>
        </div>
        <el-menu :default-active="activePath" unique-opened :collapse="isCollapse">
            <el-menu-item index="/" @click="OnSwitchRoutes('/')">
                <span>服务导航</span>
            </el-menu-item>
            <el-menu-item index="/accountInfo" @click="OnSwitchRoutes('/accountInfo')">
                <span>个人中心</span>
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
