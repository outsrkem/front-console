<template>
    <div>
        <el-card>
            <div>
                <div class="hint-message">
                    <el-text>
                        <el-icon style="color: #1476ff"><WarningFilled /></el-icon>
                        <span style="margin-left: 5px">
                            如果访问凭据泄露，会带来数据泄露风险，且每个访问凭据仅能下载一次，为了账号安全性，建议您定期更换并妥善保存访问凭据。
                        </span>
                    </el-text>
                </div>
            </div>
            <div>
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    v-loading="loading"
                    element-loading-text="加载中"
                    element-loading-spinner="el-icon-loading"
                >
                    <el-table-column prop="access" label="密钥ID" />
                    <el-table-column prop="description" label="描述" show-overflow-tooltip />
                    <el-table-column prop="status" label="状态">
                        <template #default="scope">
                            <div class="icon" v-if="scope.row.status === 'active'" style="display: flex; align-items: center">
                                <el-icon :size="14" style="color: #50d4ab; padding-right: 10px"><SuccessFilled /></el-icon>
                                <span>启用</span>
                            </div>
                            <div class="icon" v-else>
                                <el-icon :size="14" style="color: #adb0b8; padding-right: 10px"><RemoveFilled /></el-icon>
                                <span>禁用</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间">
                        <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
                    </el-table-column>
                    <el-table-column prop="last_use_at" label="最近使用时间">
                        <template #default="scope">{{ formatDate(scope.row.last_use_at) }}</template>
                    </el-table-column>
                    <el-table-column prop="" label="操作">
                        <template #default="scope">
                            <el-button link type="primary" @click="onButton">编辑</el-button>
                            <el-button link type="primary" @click="onDeleteCredential(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
import { RemoveFilled, WarningFilled, SuccessFilled } from "@element-plus/icons-vue";
import { formatTime } from "@/utils/date.js";
import { GetCredential, DeleteCredential } from "@/api/index.js";
export default {
    name: "CredentialIndex",
    components: {
        WarningFilled,
        RemoveFilled,
        SuccessFilled,
    },
    data() {
        return {
            tableData: [],
            loading: true,
            timeoutId: null,
        };
    },
    methods: {
        formatDate(time) {
            return formatTime(time);
        },
        loadGetCredential: function () {
            GetCredential()
                .then((res) => {
                    this.tableData = res.payload.items;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        loadDeleteCredential: function (access) {
            // access = this.access;
            const data = { credential: { access: access } };
            DeleteCredential(data)
                .then(() => {
                    this.onRefresh();
                    this.$notify({ duration: 2000, title: "删除成功", type: "success" });
                })
                .catch((err) => {
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "删除失败", message: msg, type: "error" });
                    this.onRefresh();
                });
        },
        onButton() {
            this.$notify({ duration: 1000, title: "功能迭代中", type: "info" });
        },
        onRefresh() {
            this.loading = true;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.loadGetCredential();
            }, 350);
        },
        onDeleteCredential(val) {
            let msg = `确认删除密钥 ${val["access"]} 吗？`;
            this.$confirm(msg, "提示", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" })
                .then(() => {
                    let access = [];
                    access.push(val["access"]);
                    this.loadDeleteCredential(access);
                })
                .catch(() => {});
        },
    },
    created() {
        this.onRefresh();
    },
};
</script>

<style scoped lang="less">
.hint-message {
    background-color: #deecff;
    padding-top: 7px;
    padding-bottom: 7px;
    border-radius: 8px;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 10px;
}
</style>
