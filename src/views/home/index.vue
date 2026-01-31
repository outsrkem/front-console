<template>
    <div>
        <el-card style="min-height: 300px">
            <template #header>
                <div class="card-header">
                    <span>服务导航</span>
                </div>
            </template>
            <div>
                <div class="list-page-wrap">
                    <div v-for="(item, index) in validEndpoint" :key="index" class="card-item">
                        <a class="block-link" :href="item.link">
                            <div class="link">
                                <h1 class="title">{{ item.title }}</h1>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { basicInfo, GetEndpoint } from "@/api/index.js";
export default {
    name: "HomeIndex",
    data() {
        return {
            endpoint: [],
            userInfo: {},
        };
    },
    computed: {
        validEndpoint() {
            return this.endpoint.filter((item) => {
                if (!item) return false;
                if (item.platform === "mobile") return false;
                return !!item.title && !!item.link;
            });
        },
    },
    methods: {
        onSkipTo(val) {
            window.location.href = val;
        },
        GetbasicInfo: async function () {
            try {
                const res = await basicInfo();
                this.userInfo = res?.payload?.userinfo || {};
            } catch (error) {
                console.error("获取用户信息失败：", error);
                this.userInfo = {};
            }
        },
        loadGetEndpoint: async function () {
            try {
                const res = await GetEndpoint();
                const rawItems = res?.payload?.items || [];
                this.endpoint = rawItems.filter((item) => !!item);
            } catch (error) {
                console.error("加载服务列表失败：", error);
            }
        },
    },
    async created() {
        this.$globalBus?.emit("updateActivePath", "/"); // 可选链避免$globalBus不存在
        this.GetbasicInfo();
        this.loadGetEndpoint();
    },
};
</script>

<style scoped lang="less">
/* 网格布局容器 - 自适应屏幕 */
.list-page-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 24px;
    width: 100%;
}

/* 卡片容器 */
.card-item {
    width: 100%;
    max-width: 320px;
}

/* 卡片链接样式 */
.block-link {
    display: block;
    text-decoration: none;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    border-top: 5px solid transparent;
    width: 100%;
    max-width: 320px;
    height: 130px;
}

/* 浮动效果 */
.block-link:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}

/* 卡片内容区域 */
.link {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: background 0.3s ease;
}

.title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    line-height: 1.4;
    word-break: break-word;
    transition: color 0.3s ease;
}

// 12组颜色循环（nth-child(12n+x)）
// 第1组：蓝色
.list-page-wrap > .card-item:nth-child(12n + 1) .block-link {
    border-top-color: #409eff;
}
.list-page-wrap > .card-item:nth-child(12n + 1) .block-link:hover .title {
    color: #409eff;
}
.list-page-wrap > .card-item:nth-child(12n + 1) .block-link:hover .link {
    background: linear-gradient(135deg, #e6f2ff 0%, #d9ebff 100%);
}

// 第2组：深灰色
.list-page-wrap > .card-item:nth-child(12n + 2) .block-link {
    border-top-color: #606266;
}
.list-page-wrap > .card-item:nth-child(12n + 2) .block-link:hover .title {
    color: #606266;
}
.list-page-wrap > .card-item:nth-child(12n + 2) .block-link:hover .link {
    background: linear-gradient(135deg, #e8e8e8 0%, #dbdbdb 100%);
}

// 第3组：绿色
.list-page-wrap > .card-item:nth-child(12n + 3) .block-link {
    border-top-color: #67c23a;
}
.list-page-wrap > .card-item:nth-child(12n + 3) .block-link:hover .title {
    color: #67c23a;
}
.list-page-wrap > .card-item:nth-child(12n + 3) .block-link:hover .link {
    background: linear-gradient(135deg, #e8f5e0 0%, #dbf0cf 100%);
}

// 第4组：橙色
.list-page-wrap > .card-item:nth-child(12n + 4) .block-link {
    border-top-color: #e6a23c;
}
.list-page-wrap > .card-item:nth-child(12n + 4) .block-link:hover .title {
    color: #e6a23c;
}
.list-page-wrap > .card-item:nth-child(12n + 4) .block-link:hover .link {
    background: linear-gradient(135deg, #faf2e6 0%, #f5e9d4 100%);
}

// 第5组：浅紫
.list-page-wrap > .card-item:nth-child(12n + 5) .block-link {
    border-top-color: #909399;
}
.list-page-wrap > .card-item:nth-child(12n + 5) .block-link:hover .title {
    color: #909399;
}
.list-page-wrap > .card-item:nth-child(12n + 5) .block-link:hover .link {
    background: linear-gradient(135deg, #f2f2f2 0%, #e6e6e6 100%);
}

// 第6组：玫红
.list-page-wrap > .card-item:nth-child(12n + 6) .block-link {
    border-top-color: #e64398;
}
.list-page-wrap > .card-item:nth-child(12n + 6) .block-link:hover .title {
    color: #e64398;
}
.list-page-wrap > .card-item:nth-child(12n + 6) .block-link:hover .link {
    background: linear-gradient(135deg, #ffe6f2 0%, #ffd9e9 100%);
}

// 第7组：青色
.list-page-wrap > .card-item:nth-child(12n + 7) .block-link {
    border-top-color: #1989fa;
}
.list-page-wrap > .card-item:nth-child(12n + 7) .block-link:hover .title {
    color: #1989fa;
}
.list-page-wrap > .card-item:nth-child(12n + 7) .block-link:hover .link {
    background: linear-gradient(135deg, #e6f7ff 0%, #d9f0ff 100%);
}

// 第8组：靛蓝
.list-page-wrap > .card-item:nth-child(12n + 8) .block-link {
    border-top-color: #6366f1;
}
.list-page-wrap > .card-item:nth-child(12n + 8) .block-link:hover .title {
    color: #6366f1;
}
.list-page-wrap > .card-item:nth-child(12n + 8) .block-link:hover .link {
    background: linear-gradient(135deg, #edefff 0%, #e0e7ff 100%);
}

// 第9组：薄荷绿
.list-page-wrap > .card-item:nth-child(12n + 9) .block-link {
    border-top-color: #10b981;
}
.list-page-wrap > .card-item:nth-child(12n + 9) .block-link:hover .title {
    color: #10b981;
}
.list-page-wrap > .card-item:nth-child(12n + 9) .block-link:hover .link {
    background: linear-gradient(135deg, #e6ffee 0%, #d9ffea 100%);
}

// 第10组：琥珀色
.list-page-wrap > .card-item:nth-child(12n + 10) .block-link {
    border-top-color: #f59e0b;
}
.list-page-wrap > .card-item:nth-child(12n + 10) .block-link:hover .title {
    color: #f59e0b;
}
.list-page-wrap > .card-item:nth-child(12n + 10) .block-link:hover .link {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

// 第11组：玫瑰红
.list-page-wrap > .card-item:nth-child(12n + 11) .block-link {
    border-top-color: #f43f5e;
}
.list-page-wrap > .card-item:nth-child(12n + 11) .block-link:hover .title {
    color: #f43f5e;
}
.list-page-wrap > .card-item:nth-child(12n + 11) .block-link:hover .link {
    background: linear-gradient(135deg, #fee2e2 0%, #fecdd3 100%);
}

// 第12组：深绿
.list-page-wrap > .card-item:nth-child(12n + 12) .block-link {
    border-top-color: #059669;
}
.list-page-wrap > .card-item:nth-child(12n + 12) .block-link:hover .title {
    color: #059669;
}
.list-page-wrap > .card-item:nth-child(12n + 12) .block-link:hover .link {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}
</style>
