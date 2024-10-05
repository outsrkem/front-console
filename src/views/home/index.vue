<template>
    <div v-if="Mobile">
        <!-- 电脑端页面 -->
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>服务导航</span>
                </div>
            </template>
            <el-container>
                <div class="list-page-wrap">
                    <div v-for="(item, index) in pcLinks" :key="index">
                        <a class="block-link" :href="item.link">
                            <div class="link">
                                <h1>{{ item.name }}</h1>
                            </div>
                        </a>
                    </div>
                </div>
            </el-container>
        </el-card>
    </div>
    <div v-else>
        <!-- 手机端页面 -->
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <div>
                <h3 style="margin-bottom: 5px">Console</h3>
            </div>
            <div style="margin-bottom: 20px">
                <el-text size="small">欢迎您，{{ userInfo.username }}。更多功能请使用电脑端访问。</el-text>
            </div>
        </div>
        <div class="mobile-link" v-for="item in mobileLinks" :key="item.id">
            <div>
                <el-button style="width: 100%" size="large" type="primary" plain @click="onSkipTo(item.link)">{{ item.name }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { basicInfo } from "@/api/index.js";
export default {
    name: "HomeIndex",
    data() {
        return {
            username: "",
            pcLinks: [
                { name: "认证中心服务", link: "/uias/#/users" },
                { name: "阳坝小学营养餐记录系统", link: "/snms" },
            ],
            mobileLinks: [{ name: "阳坝小学营养餐记录系统", link: "/snms" }],
            Mobile: true,
            userInfo: {},
        };
    },
    methods: {
        isMobile() {
            //该方法用于判断是否进入手机端
            let flag = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
            return flag;
        },
        onSkipTo(val) {
            window.location.href = val;
        },
        GetbasicInfo: function () {
            basicInfo()
                .then((res) => {
                    this.userInfo = res.payload.userinfo;
                })
                .catch(() => {});
        },
    },
    created() {
        if (this.isMobile()) {
            this.Mobile = false;
            this.$router.push({ name: "homeMobile" });
        } else {
            this.$router.push({ name: "homePc" });
        }
        this.GetbasicInfo();
    },
};
</script>

<style scoped lang="less">
.list-page-wrap {
    width: 85%;
    display: flex;
    .link {
        display: flex;
        width: 260px;
        background-color: #f7f7f7;
        margin-right: 10px;
        margin-left: 10px;
        border-radius: 12px; /* 圆角大小根据需求调整，但通常小于宽度和高度的一半 */
        padding-left: 18px; /* 内部填充，让内容不会紧贴边框 */
        padding-right: 28px; /* 内部填充，让内容不会紧贴边框     */
        transition: transform 0.1s ease, box-shadow 0.1s ease; /* 平滑过渡效果 */
        cursor: pointer;
    }
    .link:hover {
        /* 当鼠标悬停时，添加阴影效果 */
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    .block-link {
        text-align: center;
        display: block; /* 使 <a> 标签表现得像块级元素 */
        text-decoration: none; /* 移除下划线（如果需要） */
        color: inherit; /* 继承父元素的文本颜色（如果需要） */
    }
    .block-link h1 {
        color: #000000;
    }
}

.mobile-link {
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 30px;
}
</style>
