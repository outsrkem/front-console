<template>
    <div>
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>我的订单</span>
                </div>
            </template>
            <div class="my_refresh">
                <el-row>
                    <el-button size="small" type="primary" style="margin-left: 10px">创建新订单</el-button>
                </el-row>
                <el-row>
                    <el-button size="small" type="primary" :icon="Refresh" @click="onRefresh" :loading="loading" style="margin-left: 10px">刷新</el-button>
                </el-row>
            </div>

            <div>
                <el-table :data="order" style="width: 100%" v-loading="loading">
                    <el-table-column prop="spec_name" label="产品名称" show-overflow-tooltip />
                    <el-table-column prop="spec_sku" label="产品规格" show-overflow-tooltip />
                    <el-table-column prop="order_time" label="创建时间">
                        <template #default="scope">{{ formatDate(scope.row.order_time) }}</template>
                    </el-table-column>
                    <el-table-column prop="expire_time" label="到期时间">
                        <template #default="scope">{{ formatDate(scope.row.order_time) }}</template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <Pagination :pageTotal="pageTotal" :pageSize="pageSize" @CurrentChange="onCurrentChange" @SizeChange="onSizeChange" />
            </div>
        </el-card>
    </div>
</template>

<script>
import Pagination from "@/components/pagination/pagination";
import { Refresh } from "@element-plus/icons-vue";
import { withDelay, convertToLimitOffset } from "../../utils/common.js";
import { formatTime } from "@/utils/date.js";
import { GetOrder } from "../../api/index.js";
export default {
    name: "OrderIndex",
    components: { Pagination },
    setup() {
        return {
            Refresh,
        };
    },
    data() {
        return {
            order: [],
            loading: true,
            pageTotal: 0,
            pageSize: 10,
            page: 1,
        };
    },
    methods: {
        formatDate(time) {
            return formatTime(time);
        },
        onRefresh() {
            this.loading = true;
            this.loadGetOrder(this.pageSize, this.page);
        },
        onCurrentChange(p) {
            this.page = p;
            this.loadGetOrder(this.pageSize, p);
        },
        onSizeChange(s) {
            this.pageSize = s;
            this.page = 1;
            this.loadGetOrder(s, 1);
        },
        loadGetOrder: function (page_size, page) {
            this.loading = true;
            const params = convertToLimitOffset(page, page_size);
            withDelay(() => GetOrder(params))
                .then((res) => {
                    this.order = res.payload.items;
                    this.pageTotal = res.payload.page_info.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    created() {
        this.$globalBus.emit("updateActivePath", "/myorder");
        this.onRefresh();
    },
};
</script>

<style scoped lang="less">
/* 刷新样式 */
.my_refresh {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
