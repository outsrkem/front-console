<template>
    <div>
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>访问凭据</span>
                </div>
            </template>

            <div class="hint-message">
                <el-text>
                    <el-icon style="color: #1476ff"><WarningFilled /></el-icon>
                    <span style="margin-left: 5px">
                        如果访问凭据泄露，会带来数据泄露风险，且每个访问凭据仅能下载一次，为了账号安全性，建议您定期更换并妥善保存访问凭据。
                    </span>
                </el-text>
            </div>

            <div class="my_refresh">
                <el-row>
                    <el-button size="small" type="primary" style="margin-left: 10px" :disabled="buttonDisable" @click="onOpenCreateCredential">
                        新增访问凭据
                    </el-button>
                    <el-text style="margin-left: 18px">您最多可以创建{{ quota }}个访问凭据。</el-text>
                </el-row>
                <el-row>
                    <el-button size="small" type="primary" :icon="Refresh" :loading="loading" style="margin-left: 10px" @click="onRefresh"> 刷新 </el-button>
                </el-row>
            </div>

            <el-table :data="tableData" style="width: 100%" v-loading="loading">
                <el-table-column type="index" width="50" />
                <el-table-column prop="access" label="密钥ID">
                    <template #default="scope">
                        <span class="access-text">{{ scope.row.access }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" show-overflow-tooltip />
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        <el-text v-if="scope.row.status === 'active'">
                            <el-icon style="color: #50d4ab; padding-right: 5px"><SuccessFilled /></el-icon>
                            <span>启用</span>
                        </el-text>
                        <el-text v-else>
                            <el-icon style="color: #adb0b8; padding-right: 5px"><RemoveFilled /></el-icon>
                            <span>停用</span>
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间">
                    <template #default="scope">{{ formatDate(scope.row.create_time) }}</template>
                </el-table-column>
                <el-table-column prop="last_use_at" label="最近使用时间">
                    <template #default="scope">{{ formatDate(scope.row.last_use_at) }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button link type="primary" @click="onEditCredential(scope.row)">编辑</el-button>
                        <el-button link type="primary" @click="onSwitchStatus(scope.row)">
                            {{ scope.row.status === "active" ? "停用" : "启用" }}
                        </el-button>
                        <el-button link type="primary" @click="onDeleteCredential(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- Edit dialog -->
        <el-dialog v-model="editDialogVisible" title="编辑" width="500px" :close-on-click-modal="false" draggable>
            <div class="dialog-body" v-loading="dialogLoading">
                <el-form :model="editForm" label-width="auto" label-position="left">
                    <el-form-item label="密钥ID" style="margin-bottom: 0">
                        <el-text>{{ editForm.access }}</el-text>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-text>{{ formatDate(editForm.create_time) }}</el-text>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input
                            v-model="editForm.description"
                            type="textarea"
                            maxlength="60"
                            show-word-limit
                            :autosize="{ minRows: 3, maxRows: 3 }"
                            placeholder="请输入描述信息" />
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button style="width: 120px" @click="editDialogVisible = false">取消</el-button>
                    <el-button style="width: 120px" type="primary" @click="onSubmitEditCredential">确定</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- Create dialog -->
        <el-dialog v-model="createDialogVisible" title="新增访问凭据" width="500px" :close-on-click-modal="false" draggable>
            <div class="dialog-body" v-loading="dialogLoading">
                <div class="hint-message">
                    <el-text>
                        <el-icon style="color: #1476ff"><WarningFilled /></el-icon>
                        <span style="margin-left: 5px">
                            如果访问凭据泄露，会带来数据泄露风险，且每个访问凭据仅能下载一次，为了账号安全性，建议您定期更换并妥善保存访问凭据。
                        </span>
                    </el-text>
                </div>
                <el-form :model="createForm" label-width="auto" label-position="top">
                    <el-form-item label="请输入凭据的描述信息">
                        <el-input
                            v-model="createForm.description"
                            type="textarea"
                            maxlength="60"
                            show-word-limit
                            :autosize="{ minRows: 3, maxRows: 3 }"
                            placeholder="凭据描述信息" />
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button style="width: 120px" @click="createDialogVisible = false">取消</el-button>
                    <el-button style="width: 120px" type="primary" @click="onSubmitCreateCredential">创建</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- Save credential dialog -->
        <el-dialog v-model="SaveCredential.DialogVisible" title="保存访问凭据" width="500px" :close-on-click-modal="false">
            <div class="save-credential-top">
                <div class="hint-message">
                    <el-text>
                        <el-icon style="color: #1476ff"><WarningFilled /></el-icon>
                        <span style="margin-left: 5px">{{ SaveCredential.hintText }}</span>
                    </el-text>
                </div>
                <el-tooltip content="复制凭据" placement="left-start">
                    <el-button link type="primary" @click="onCopyCredential">
                        <el-icon :size="18"><CopyDocument /></el-icon>
                    </el-button>
                </el-tooltip>
            </div>
            <div class="code-container" @click="SaveCredential.showFullCode = true">
                <pre class="codepre">{{ SaveCredential.Data }}</pre>
                <transition name="fade">
                    <div class="overlay" v-if="!SaveCredential.showFullCode">
                        <span class="overlay-text">{{ SaveCredential.overlayText }}</span>
                    </div>
                </transition>
            </div>
        </el-dialog>

        <!-- Delete dialog -->
        <el-dialog
            v-model="deleteDialogVisible"
            :title="deleteSuccess ? '删除成功' : '确定删除该访问凭据？'"
            width="800px"
            :close-on-click-modal="false"
            :show-close="!deleteSuccess"
            draggable>
            <div class="dialog-body" v-loading="dialogLoading">
                <!-- Confirm delete -->
                <template v-if="!deleteSuccess">
                    <div class="hint-message">
                        <el-text>
                            <el-icon style="color: #1476ff"><WarningFilled /></el-icon>
                            <span style="margin-left: 5px">删除后该凭据将无法再继续使用，且删除操作无法恢复，请谨慎删除。</span>
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
                    <div class="dialog-footer">
                        <el-button style="width: 120px" @click="deleteDialogVisible = false">取消</el-button>
                        <el-button style="width: 120px" type="primary" @click="onSubmitDeleteCredential">确定</el-button>
                    </div>
                </template>
                <el-result v-else icon="success" sub-title="该凭据已删除">
                    <template #extra>
                        <el-button style="width: 120px" type="primary" @click="handleDeleteSuccessConfirm">确 定</el-button>
                    </template>
                </el-result>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { Refresh, RemoveFilled, WarningFilled, SuccessFilled, CopyDocument } from "@element-plus/icons-vue";
import { GetCredential, DeleteCredential, EditCredential, CreateCredential } from "../../api/index.js";
import { msgcon } from "../../utils/message.js";
import { formatTime } from "../../utils/date.js";
import { withDelay } from "../../utils/common.js";

export default {
    name: "CredentialIndex",
    components: { WarningFilled, RemoveFilled, SuccessFilled, CopyDocument },
    setup() {
        return { Refresh };
    },
    data() {
        return {
            quota: 0,
            tableData: [],
            loading: true,
            dialogLoading: false,
            buttonDisable: true,
            // Edit
            editDialogVisible: false,
            editForm: { access: "", create_time: "", description: "" },
            // Create
            createDialogVisible: false,
            createForm: { description: "" },
            // Delete
            deleteDialogVisible: false,
            deleteFrom: [],
            deleteSuccess: false,
            // Save
            SaveCredential: {
                DialogVisible: false,
                Data: null,
                hintText: "密钥信息只展示一次，请复制并妥善保存。",
                overlayText: "点击查看密钥信息",
                showFullCode: false,
            },
        };
    },
    created() {
        this.$globalBus.emit("updateActivePath", "/credential");
        this.onRefresh();
    },
    methods: {
        formatDate(time) {
            return formatTime(time);
        },

        // Unified failure handling: refresh list + show error message
        handleFail(err, action) {
            this.onRefresh();
            const msg = err?.data?.metadata?.message || "";
            this.$message.error(msgcon(action + "失败" + msg));
        },

        onRefresh() {
            this.loading = true;
            this.loadGetCredential();
        },

        async loadGetCredential() {
            try {
                const res = await withDelay(() => GetCredential());
                this.tableData = res.payload.items;
                this.quota = res.payload.quota;
                this.buttonDisable = this.quota <= this.tableData.length;
            } catch (_) {
                // Silent on list load failure
            } finally {
                this.loading = false;
            }
        },

        // ------------------------- Edit -------------------------
        onEditCredential(row) {
            this.editForm = {
                access: row.access,
                create_time: row.create_time,
                description: row.description,
            };
            this.editDialogVisible = true;
        },
        async onSubmitEditCredential() {
            this.dialogLoading = true;
            const data = {
                credential: {
                    access: this.editForm.access,
                    description: this.editForm.description,
                },
            };
            try {
                await withDelay(() => EditCredential(data));
                this.editDialogVisible = false;
                this.onRefresh();
                this.$message.success(msgcon("操作成功"));
            } catch (err) {
                this.handleFail(err, "操作");
            } finally {
                this.dialogLoading = false;
            }
        },

        // ------------------------- Create -------------------------
        onOpenCreateCredential() {
            this.createForm.description = "";
            this.createDialogVisible = true;
        },
        async onSubmitCreateCredential() {
            this.dialogLoading = true;
            const data = { credential: { description: this.createForm.description } };
            try {
                const res = await withDelay(() => CreateCredential(data));
                this.createDialogVisible = false;
                this.onRefresh();
                this.$message.success(msgcon("创建成功"));
                this.createForm.description = "";
                // Reset display state before opening the save dialog to avoid exposing plaintext on the second creation
                this.SaveCredential.Data = res.payload;
                this.SaveCredential.showFullCode = false;
                this.SaveCredential.DialogVisible = true;
            } catch (err) {
                this.handleFail(err, "创建");
            } finally {
                this.dialogLoading = false;
            }
        },

        // ------------------------- Switch status -------------------------
        async onSwitchStatus(row) {
            const data = {
                credential: {
                    access: row.access,
                    status: row.status === "active" ? "inactive" : "active",
                },
            };
            try {
                await withDelay(() => EditCredential(data));
                this.onRefresh();
                this.$message.success(msgcon("操作成功"));
            } catch (err) {
                this.handleFail(err, "操作");
            }
        },

        // ------------------------- Delete -------------------------
        onDeleteCredential(row) {
            this.deleteFrom = [row];
            this.deleteSuccess = false;
            this.deleteDialogVisible = true;
        },
        async onSubmitDeleteCredential() {
            this.dialogLoading = true;
            // Keep the same request body as before: access passed as an array
            const data = { credential: { access: [this.deleteFrom[0].access] } };
            try {
                await withDelay(() => DeleteCredential(data));
                // Do not close the dialog immediately; switch to the success result page and wait for confirmation
                this.deleteSuccess = true;
            } catch (err) {
                this.handleFail(err, "删除");
            } finally {
                this.dialogLoading = false;
            }
        },
        handleDeleteSuccessConfirm() {
            this.deleteDialogVisible = false;
            this.deleteSuccess = false;
            this.onRefresh();
        },

        // ------------------------- Copy credential -------------------------
        async onCopyCredential() {
            const raw = this.SaveCredential.Data;
            if (!raw) {
                this.$message.warning(msgcon("没有可复制的内容"));
                return;
            }
            // Support both string and object data shapes
            const text = typeof raw === "string" ? raw : JSON.stringify(raw, null, 2);
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                } else {
                    // Fallback: support http environments (common for intranet deployments)
                    const ta = document.createElement("textarea");
                    ta.value = text;
                    ta.style.position = "fixed";
                    ta.style.opacity = "0";
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand("copy");
                    document.body.removeChild(ta);
                }
                this.$message.success(msgcon("复制成功"));
            } catch (_) {
                this.$message.error(msgcon("复制失败"));
            }
        },
    },
};
</script>

<style scoped lang="less">
.hint-message {
    background-color: #deecff;
    padding: 7px 16px;
    border-radius: 8px;
    margin-bottom: 10px;
}

.my_refresh {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.codepre {
    box-sizing: border-box;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    overflow: auto;
    font-family: "Menlo", "Monaco", "Consolas", "Courier New", monospace;
    font-size: 13px;
    padding: 1px;
    margin: 0;
    line-height: 1.2;
    color: #333333;
    border-radius: 4px;
    background-color: #f5f5f5;
}

.code-container {
    position: relative;
    max-height: 300px;
    overflow: auto;
    margin-top: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 10px;
    background-color: #f5f5f5;
}

.overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    backdrop-filter: blur(3px);
}

.overlay-text {
    font-size: 16px;
    color: #1476ff;
    font-weight: bold;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.access-text {
    font-family: "Consolas", Courier, monospace;
    font-size: 16px;
}

.dialog-body {
    margin: 0 20px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* Save credential dialog: hint bar + copy button on the same row */
.save-credential-top {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.save-credential-top .hint-message {
    flex: 1;
    margin-bottom: 0;
}
</style>
