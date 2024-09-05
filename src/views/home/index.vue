<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header">
                    <div class="header-button">
                        <el-button link>欢迎您，{{ username }}</el-button>
                        <el-button link style="margin-left: 20px;" @click="onUserCenter">个人中心</el-button>
                        <el-button link @click="Logout" style="margin-left: 20px;">退出</el-button>
                    </div>
            </el-header>
            <el-main>
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
                { name: 'sre-devops', link: '/uias-devops/' },
                { name: '身份认证中心', link: '/uias/' },
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
            this.$router.push({ path: '/accountInfo' })
        },
    },
    created() {
        this.GetbasicInfo()
    },
}
</script>
         
<style scoped lang="less">
    .link-container {
        // width: auto;
        // text-align: center;
        // border: 3px solid rgb(7, 112, 7);
        display: flex;
        justify-content: center; /* 水平居中 */  
        align-items: center; /* 垂直居中 */
    }
    .list-page-wrap {
        margin-top: 50px;
        width: 85%;
        // border: 3px solid red; /* 调试用，设置边框 */ 
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
        /* 可以添加更多样式以匹配你的网站设计 */  
    }  
    
    .block-link h1 {  
        /* 如果需要，可以添加特定于 <h1> 的样式 */
        color: #000000;
    }
    .header {
        height: 38px;
        display: flex;
        justify-content: center; /* 水平居中 */  
        align-items: center; /* 垂直居中 */
        border-bottom: 1px solid #adb0b8;
        background-color: #d3dce6;
        .header-button {
            width: 55%;
        }
    }
</style>
          