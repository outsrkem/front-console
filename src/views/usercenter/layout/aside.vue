<template>
    <div class="el-aside">
        <div style="padding-left: 44px;">
            <h5 class="mb-2">账号中心</h5>
        </div>
        <el-menu :default-active="activePath" unique-opened>
            <el-menu-item index="/" @click="OnSwitchRoutes('/')">
                <i class="el-icon-house"></i><span>首页</span>
            </el-menu-item>
            <el-menu-item index="/accountInfo" @click="OnSwitchRoutes('/accountInfo')">
                <i class="el-icon-menu"></i><span>基本信息</span>
            </el-menu-item>
            <!-- <el-menu-item index="/actions" @click="OnSwitchRoutes('/preferenceConfig')">
                <i class="el-icon-menu"></i><span>账户设置</span>
            </el-menu-item> -->
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'AppAside',
    components: {},
    props: {},
    data() {
        return {
            activePath: '',
            menusList: []
        }
    },
    computed: {},
    watch: {},
    created() {
        this.activePath = window.sessionStorage.getItem('active-path') || '/'
    },
    mounted() {},
    methods: {
        saveActivePath(activePath) {
            this.activePath = activePath
            window.sessionStorage.setItem('active-path', activePath)
        },
        // 保存菜单激活状态
        OnSwitchRoutes(activePath) {
            this.$router.push({ path: activePath })
            this.saveActivePath(activePath)
        }
    }
}
</script>

<style scoped lang="less">
    .el-aside {
        background-color: #ffffff;
        .el-menu {
            border-right: none;
        }
    }
</style>
