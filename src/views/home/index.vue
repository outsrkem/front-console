<template>
    <div class="header-container" style="width: 100%;">
        <div class="header-button">
            <span>欢迎您，{{ username }}</span>
            <button  type="button" @click="onUserCenter">个人中心</button>
            <button  type="button" @click="onToConsole">控制台</button>
            <button  type="button" @click="Logout">退出</button>
        </div>
    </div>
    <div class="common-layout">
        <el-container>
            <el-main class="main-content">
                <div class="link-container">
                    <div class="list-page-wrap">
                        <div class="link"  v-for="item in links" :key="item.id">
                            <a :href=item.link target="_blank" class="block-link">
                                <div>
                                    <h1>{{ item.name }}</h1>
                                </div>
                            </a> 
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { logout } from '../../api'
import { basicInfo } from '../../api'
export default {
    name: 'HomeIndex',
    data() {
        return {
            username: '',
            links: [
                { name: 'sre-devops', link: '/uias-devops' },
                { name: '身份认证中心', link: '/uias' },
            ]
        }
    },
    methods: {
        GetbasicInfo: async function () {
            const res = await basicInfo()
            this.userInfo = JSON.stringify(res)
            this.username = res.payload.userinfo.username
            window.sessionStorage.setItem('userBasicInfo', JSON.stringify(res.payload))
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
        onUserCenter() {
            let wl = window.location
            let accountInfoUrl = wl.protocol + '//' + wl.host + '/#/accountInfo'
            window.location.assign(accountInfoUrl);
        },
        onToConsole() {
            let wl = window.location
            let accountInfoUrl = wl.protocol + '//' + wl.host 
            window.location.assign(accountInfoUrl);
        }
    },
    created() {
        this.GetbasicInfo()
    },
}
</script>
         
<style scoped lang="less">
    .link-container {
        display: flex;
        justify-content: center; /* 水平居中 */  
        align-items: center; /* 垂直居中 */
    }
    .list-page-wrap {
        margin-top: 50px;
        width: 85%;
        display: flex;

    }
    .link {
        // border: 3px solid rgb(36, 5, 65);
        width: 300px;
        background-color: #f0f4ff;
        margin-right: 10px;
        margin-left: 10px;
        border-radius: 12px; /* 圆角大小根据需求调整，但通常小于宽度和高度的一半 */
        padding-left: 18px; /* 内部填充，让内容不会紧贴边框 */ 
        padding-right: 28px; /* 内部填充，让内容不会紧贴边框 */
        transition: transform 0.3s ease, box-shadow 0.3s ease; /* 平滑过渡效果 */
        cursor: pointer;
    }
    .link:hover {  
        /* 当鼠标悬停时，添加阴影效果 */
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }
    .moved-down {  
        transform: translateY(20px); /* 向下移动20px */
    } 

    .block-link {
        display: block; /* 使 <a> 标签表现得像块级元素 */
        text-decoration: none; /* 移除下划线（如果需要） */
        color: inherit; /* 继承父元素的文本颜色（如果需要） */
    }
    .block-link h1 {
        color: #000000;
    }
    .common-layout {
        min-height: 100vh; /* 使用 vh 单位来确保至少占据整个视口的高度 */
        display: flex; /* 保持 Flexbox 布局，如果你的其他样式依赖于它 */
        flex-direction: column; /* 如果需要的话，设置为列方向 */
    }
    .main-content {
        display: flex;
        flex-direction: column;
        justify-content: center; /* 垂直居中 */
        align-items: center; /* 水平居中（如果需要）*/
        height: 100%; /* 继承父元素的高度 */
    }
    .header-container {
        height: 38px;
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */
        border-bottom: 1px solid #adb0b8;
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
