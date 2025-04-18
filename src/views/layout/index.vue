<template>
    <div class="custom-layout">
        <el-container>
            <el-header class="header-content">
                <el-row>
                    <el-space :size="10" spacer="">
                        <span style="padding-left: 160px"></span>
                        <el-link class="header-text line-spacing" href="/console">控制台</el-link>
                        <el-button type="" link @click="openProjectDialog"> {{ project.current.title }} </el-button>
                    </el-space>
                </el-row>
                <el-row>
                    <div>
                        <el-space :size="20" spacer="">
                            <el-text class="header-text line-spacing">{{ dateMessage }}</el-text>
                            <el-text class="header-text line-spacing">欢迎您，{{ displayedName }}</el-text>
                            <el-button class="header-text line-spacing" link @click="onUserCenter">个人信息</el-button>
                            <el-button link @click="Logout">退出</el-button>
                        </el-space>
                    </div>
                </el-row>
            </el-header>
            <el-container class="main-content">
                <el-aside class="aside" width="auth">
                    <app-aside class="aside-menu" />
                </el-aside>
                <el-main class="main">
                    <!-- 子路由出口 -->
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
        <div>
            <el-dialog v-model="project.dialogTableVisible" title="请选择项目" width="800">
                <el-space wrap style="justify-content: space-evenly">
                    <span v-for="(item, index) in project.data" :key="index">
                        <el-button style="width: 220px" :type="item.type" @click="onSelectProject(item)">{{ item.title }}</el-button>
                    </span>
                </el-space>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import AppAside from "./aside.vue";
import { toLoginPage, toUserCenter, toConsole } from "@/utils/common.js";
import { logout, basicInfo, GetProject } from "@/api/index.js";
export default {
    name: "LayoutIndex",
    components: {
        AppAside,
    },
    props: {},
    data() {
        return {
            userInfo: {},
            breadcrumb: [], // 面包屑导航
            dateMessage: "",
            project: {
                data: [],
                dialogTableVisible: false,
                current: {},
            },
        };
    },
    computed: {
        displayedName() {
            return this.userInfo.username + "(" + this.userInfo.account + ")";
        },
    },
    methods: {
        LoadLogOut: async function () {
            await logout().then(() => {
                window.sessionStorage.removeItem("active-path");
                this.$cookies.remove("session");
                toLoginPage();
            });
        },
        GetbasicInfo: async function () {
            const res = await basicInfo();
            this.userInfo = res.payload.userinfo;
        },
        Logout() {
            this.LoadLogOut();
        },
        onUserCenter() {
            toUserCenter();
        },
        onConsole() {
            toConsole();
        },
        // 加载项目数据
        loadGetProject: async function () {
            const res = await GetProject();
            this.project.data = res.payload.items;
            this.setProject();
        },
        // 打开选择项目弹窗
        openProjectDialog() {
            this.project.dialogTableVisible = true;
        },
        // 选择项目
        onSelectProject(val) {
            this.project.current = val;
            this.setProjectUrl(val);
            this.setProjectLocalStorage(val);
            this.setProjectButtonType(val.id);
            setTimeout(() => {
                // 延时关闭，优化视觉体验
                this.project.dialogTableVisible = false;
            }, 210);
        },
        // 设置项目url参数
        setProjectUrl(val) {
            let url = new URL(window.location.href);
            url.searchParams.set("project", val.name);
            window.history.pushState({}, "", url);
        },
        // 保存项目数据到localStorage
        setProjectLocalStorage(val) {
            window.localStorage.setItem("project", JSON.stringify(val));
        },
        // 设置默认项目
        setDefaultProject() {
            const foundProject = this.project.data.find((project) => project.name === "default");
            this.project.current = foundProject;
            this.setProjectLocalStorage(this.project.current);
            this.setProjectUrl(foundProject);
        },
        // 设置当前项目
        setProject() {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            const projectName = params.get("project");
            if (projectName != null) {
                const foundProject = this.project.data.find((project) => project.name === projectName);
                if (foundProject == undefined) {
                    this.setDefaultProject();
                    return;
                }
                this.project.current = foundProject;
                this.setProjectLocalStorage(this.project.current);
                this.setProjectButtonType(this.project.current.id);
                return;
            }
            // TODO localStorage存储的数据如果异常，则会存在问题
            const project = window.localStorage.getItem("project");
            if (project != null) {
                try {
                    this.project.current = JSON.parse(project);
                    this.setProjectUrl(this.project.current);
                    this.setProjectButtonType(this.project.current.id);
                    return;
                } catch (e) {
                    console.log(e);
                }
            }
            // url和localStorage都没有，则加载默认项目
            this.setDefaultProject();
        },

        // 设置项目按钮的状态
        setProjectButtonType(projectId) {
            let data = this.project.data;
            return data.map((item) => {
                if (item.id === projectId) {
                    item.type = "primary";
                } else {
                    item.type = "";
                }
                return;
            });
        },
        CurrentTime() {
            // 返回一个对象，包含日期、时间和星期几
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以要+1
            const day = String(now.getDate()).padStart(2, "0");
            // const hours = String(now.getHours()).padStart(2, "0");
            // const minutes = String(now.getMinutes()).padStart(2, "0");
            // const seconds = String(now.getSeconds()).padStart(2, "0");
            const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            const _weekday = weekdays[now.getDay()];
            this.dateMessage = `今天是${year}年${month}月${day}日 ${_weekday}`;
        },
    },
    created() {
        this.GetbasicInfo();
        this.CurrentTime();
        this.loadGetProject();
    },
};
</script>

<style scoped lang="less">
.custom-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
.header-content {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    background-color: #ffffff;
    z-index: 1000;
}
.main-content {
    padding-top: 50px;
    position: fixed;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .aside {
        background-color: #d3dce6;
        .aside-menu {
            height: 100%;
        }
    }
    .main {
        background-color: #e9eef3;
        padding: 10px;
    }
}
</style>
