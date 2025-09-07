<template>
    <div>
        <!-- 手机端页面 -->
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <div>
                <h3 style="margin-bottom: 5px">控制台</h3>
            </div>
            <div style="margin-bottom: 20px">
                <el-text size="small">欢迎您，{{ userInfo.username }}。更多功能请使用电脑端访问。</el-text>
            </div>
        </div>
        <div class="mobile-link" v-for="item in endpoint" :key="item.id">
            <div v-if="!(item.platform === 'pc')">
                <el-button style="width: 100%" size="large" type="primary" plain @click="onSkipTo(item.link)">
                    {{ item.title }}
                </el-button>
            </div>
        </div>
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
.mobile-link {
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 30px;
}
</style>
