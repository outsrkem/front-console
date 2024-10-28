<template>
    <div>
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>我的凭据</span>
                </div>
            </template>
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
            <div class="my_refresh">
                <el-row>
                    <el-button size="small" type="primary" style="margin-left: 10px" @click="onOpenCreateCredential()">新增访问凭据</el-button>
                    <el-text style="margin-left: 18px">您最多可以创建2个访问凭据。</el-text>
                </el-row>
                <el-row>
                    <el-button size="small" type="primary" @click="onRefresh" :loading="loading" style="margin-left: 10px">刷新</el-button>
                </el-row>
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
                                <el-icon :size="14" style="color: #50d4ab; padding-right: 5px"><SuccessFilled /></el-icon>
                                <span>启用</span>
                            </div>
                            <div class="icon" v-else>
                                <el-icon :size="14" style="color: #adb0b8; padding-right: 5px"><RemoveFilled /></el-icon>
                                <span>停用</span>
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
                            <el-button link type="primary" @click="onEditCredential(scope.row)">编辑</el-button>
                            <span v-if="scope.row.status === 'active'">
                                <el-button link type="primary" @click="onSwitchStatus(scope.row)">停用</el-button>
                            </span>
                            <span v-if="scope.row.status === 'inactive'">
                                <el-button link type="primary" @click="onSwitchStatus(scope.row)">启用</el-button>
                            </span>
                            <el-button link type="primary" @click="onDeleteCredential(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <el-dialog v-model="editDialogVisible" title="编辑" width="500" :close-on-click-modal="false" draggable>
            <div style="margin-left: 80px; margin-right: 80px">
                <el-form :model="editForm" label-width="auto" style="max-width: auto" label-position="left">
                    <el-form-item label="密钥ID">
                        <el-text>{{ editForm.access }}</el-text>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-text>{{ formatDate(editForm.create_time) }}</el-text>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input
                            v-model="editForm.description"
                            type="textarea"
                            maxlength="128"
                            show-word-limit
                            :autosize="{ minRows: 4, maxRows: 4 }"
                            placeholder="请输入描述信息"
                        />
                    </el-form-item>
                </el-form>
                <div style="display: flex; justify-content: flex-end; align-items: center">
                    <el-form-item size="small">
                        <el-button @click="editDialogVisible = false">取消</el-button>
                        <el-button type="primary" :loading="editButtonLoading" @click="onSubmitEditCredential">确定</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-dialog>

        <el-dialog v-model="createDialogVisible" title="新增访问凭据" width="500" :close-on-click-modal="false" draggable>
            <div style="margin-left: 50px; margin-right: 50px; margin-top: 22px">
                <div class="hint-message">
                    <el-text>
                        <el-icon style="color: #1476ff"><WarningFilled /></el-icon>
                        <span style="margin-left: 5px">
                            如果访问凭据泄露，会带来数据泄露风险，且每个访问凭据仅能下载一次，为了账号安全性，建议您定期更换并妥善保存访问凭据。
                        </span>
                    </el-text>
                </div>
                <el-form :model="createForm" label-width="auto" style="max-width: auto" label-position="left">
                    <el-form-item label="描述">
                        <el-input
                            v-model="createForm.description"
                            type="textarea"
                            maxlength="128"
                            show-word-limit
                            :autosize="{ minRows: 4, maxRows: 4 }"
                            placeholder="请输入描述信息"
                        />
                    </el-form-item>
                </el-form>
                <div style="display: flex; justify-content: flex-end; align-items: center">
                    <el-form-item size="small">
                        <el-button @click="createDialogVisible = false">取消</el-button>
                        <el-button type="primary" :loading="createButtonLoading" @click="onSubmitCreateCredential">创建</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-dialog>

        <el-dialog v-model="deleteDialogVisible" title="确定删除该访问凭据？" width="800" :close-on-click-modal="false" draggable>
            <div style="margin-left: 10px; margin-right: 10px">
                <div class="hint-message">
                    <el-text>
                        <el-icon style="color: #1476ff"><WarningFilled /></el-icon>
                        <span style="margin-left: 5px">删除后该凭据将无法再继续使用，且删除操作无法恢复，请谨慎删除。 </span>
                    </el-text>
                </div>
                <div style="margin-bottom: 20px">
                    <el-table :data="deleteFrom" style="width: 100%">
                        <el-table-column prop="access" label="密钥ID" />
                        <el-table-column prop="description" label="描述" show-overflow-tooltip />
                        <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip>
                            <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="display: flex; justify-content: flex-end; align-items: center">
                    <el-form-item size="small">
                        <el-button @click="deleteDialogVisible = false">取消</el-button>
                        <el-button type="primary" :loading="deleteButtonLoading" @click="onSubmitDeleteCredential">确定</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { RemoveFilled, WarningFilled, SuccessFilled } from "@element-plus/icons-vue";
import { formatTime } from "@/utils/date.js";
import { GetCredential, DeleteCredential, EditCredential, CreateCredential } from "@/api/index.js";
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
            // 编辑
            editDialogVisible: false,
            editForm: {
                access: "",
                create_time: "",
            },
            editButtonLoading: false,
            // 创建
            createDialogVisible: false,
            createForm: {
                description: "",
            },
            createButtonLoading: false,
            // 删除
            deleteDialogVisible: false,
            deleteFrom: [],
            deleteButtonLoading: false,
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
            const data = { credential: { access: access } };
            DeleteCredential(data)
                .then(() => {
                    this.deleteDialogVisible = false;
                    this.onRefresh();
                    this.$notify({ duration: 2000, title: "删除成功", type: "success" });
                    this.deleteButtonLoading = false;
                })
                .catch((err) => {
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "删除失败", message: msg, type: "error" });
                    this.deleteButtonLoading = false;
                    this.onRefresh();
                });
        },
        loadEditCredential: function (data) {
            EditCredential(data)
                .then(() => {
                    this.editDialogVisible = false;
                    this.onRefresh();
                    this.$notify({ duration: 2000, title: "操作成功", type: "success" });
                    this.editButtonLoading = false;
                })
                .catch((err) => {
                    this.onRefresh();
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "操作失败", message: msg, type: "error" });
                    this.editButtonLoading = false;
                });
        },
        loadCreateCredential: function (data) {
            CreateCredential(data)
                .then(() => {
                    this.createDialogVisible = false;
                    this.onRefresh();
                    this.$notify({ duration: 2000, title: "创建成功", type: "success" });
                    this.createButtonLoading = false;
                    this.createForm.description = "";
                })
                .catch((err) => {
                    this.onRefresh();
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "创建失败", message: msg, type: "error" });
                    this.createButtonLoading = false;
                });
        },
        onRefresh() {
            this.loading = true;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.loadGetCredential();
            }, 350);
        },
        onEditCredential(val) {
            this.editDialogVisible = true;
            this.editForm.access = val["access"];
            this.editForm.create_time = val["create_time"];
            this.editForm.description = "";
        },
        onSubmitEditCredential() {
            this.editButtonLoading = true;
            const data = { credential: { access: this.editForm.access, description: this.editForm.description } };
            this.loadEditCredential(data);
        },
        onOpenCreateCredential() {
            this.createDialogVisible = true;
        },
        onSubmitCreateCredential() {
            this.createButtonLoading = true;
            const data = { credential: { description: this.createForm.description } };
            this.loadCreateCredential(data);
        },
        onSwitchStatus(val) {
            let access = val["access"];
            let status = val["status"] === "active" ? "inactive" : "active";
            const data = { credential: { access: access, status: status } };
            this.loadEditCredential(data);
        },
        onDeleteCredential(val) {
            this.deleteFrom = [];
            this.deleteFrom.push(val);
            this.deleteDialogVisible = true;
        },
        onSubmitDeleteCredential() {
            this.deleteButtonLoading = true;
            console.log(this.deleteFrom[0].access);
            let access = [];
            access.push(this.deleteFrom[0].access);
            this.loadDeleteCredential(access);
        },
    },
    created() {
        this.$globalBus.emit("updateActivePath", "/credential");
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
.my_refresh {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
