<template>
    <div>
        <!-- 电脑端页面 -->
        <el-card style="min-height: 300px">
            <template #header>
                <div class="card-header">
                    <span>服务导航</span>
                </div>
            </template>
            <el-container>
                <div class="list-page-wrap">
                    <div v-for="(item, index) in endpoint" :key="index">
                        <div v-if="!(item.platform === 'mobile')">
                            <a class="block-link" :href="item.link">
                                <div class="link">
                                    <h1 class="title">{{ item.title }}</h1>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </el-container>
        </el-card>
    </div>
</template>

<script>
import { basicInfo, GetEndpoint } from "@/api/index.js";
export default {
    name: "HomeIndex",
    data() {
        return {
            endpoint: [], // [{"name":"xxx xxx","title":"xxx","link":"/xxx","platform":"pc"}]
            userInfo: {},
        };
    },
    methods: {
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
        // 获取控制台服务链接
        loadGetEndpoint: async function () {
            const res = await GetEndpoint();
            this.endpoint = res.payload.items;
        },
    },
    created() {
        this.$globalBus.emit("updateActivePath", "/");
        this.GetbasicInfo();
        this.loadGetEndpoint();
    },
};
</script>

<style scoped lang="less">
.title {
    font-size: 1em;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
}
.list-page-wrap {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    .link {
        display: flex;
        background-color: #f7f7f7;
        border-radius: 12px; /* 圆角大小根据需求调整，但通常小于宽度和高度的一半 */
        padding-left: 18px; /* 内部填充，让内容不会紧贴边框 */
        padding-right: 18px; /* 内部填充，让内容不会紧贴边框     */
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
</style>
