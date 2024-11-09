<template>
    <div>
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>个人中心</span>
                </div>
            </template>
            <div v-loading="loading" element-loading-text="正在加载······">
                <div class="hint-message">
                    <el-text>
                        <el-icon style="color: #1476ff"><WarningFilled /></el-icon>
                        <span style="margin-left: 5px"
                            >绑定邮箱、手机、虚拟MF并开启登录保护，能够提升账号的安全性。为防止密码泄露，建议定期修改密码。
                        </span>
                    </el-text>
                </div>
                <div>
                    <el-divider style="margin-top: 20px; margin-bottom: 20px" content-position="left">基础信息</el-divider>
                    <div class="line-row">
                        <el-text class="title">账号名称</el-text>
                        <el-text class="value"> {{ userInfo.account }}</el-text>
                    </div>
                    <div class="line-row">
                        <el-text class="title">用户名</el-text>
                        <el-text class="value">
                            <span style="margin-right: 10px">{{ userInfo.username }}</span>
                            <el-tooltip class="box-item" effect="light" content="用户名由管理员设置，如需修改，请联系管理员。" placement="right">
                                <el-icon style="color: #9fa1a5"><QuestionFilled /></el-icon>
                            </el-tooltip>
                        </el-text>
                    </div>
                    <div class="line-row">
                        <el-text class="title">注册时间</el-text>
                        <el-text class="value">{{ formatDate(userInfo.create_time) }}</el-text>
                    </div>
                    <div class="line-row">
                        <el-text class="title">最近登录时间</el-text>
                        <el-text class="value">{{ formatDate(userInfo.last_login_at) }}</el-text>
                    </div>

                    <el-divider style="margin-top: 20px; margin-bottom: 20px" content-position="left">安全信息</el-divider>
                    <div class="line-row">
                        <el-text class="title">手机号码</el-text>
                        <span v-if="userInfo.mobile === ''">
                            <el-text class="value">
                                <el-icon class="warning-color"><WarningFilled /></el-icon>
                                <span style="margin-left: 5px">未绑定</span>
                            </el-text>
                        </span>
                        <span v-if="userInfo.mobile !== ''">
                            <el-text class="value">
                                <el-icon class="success-color"><SuccessFilled /></el-icon>
                                <span style="margin-left: 5px">{{ userInfo.mobile }}</span>
                            </el-text>
                        </span>
                    </div>
                    <div class="line-row">
                        <el-text class="title">邮箱号码</el-text>
                        <span v-if="userInfo.email === ''">
                            <el-text class="value">
                                <el-icon class="warning-color"><WarningFilled /></el-icon>
                                <span style="margin-left: 5px">未绑定</span>
                            </el-text>
                            <el-button link type="primary" @click="onUpdateEmail()">绑定</el-button>
                        </span>
                        <span v-if="userInfo.email !== ''">
                            <el-text class="value">
                                <el-icon class="success-color"><SuccessFilled /></el-icon>
                                <span style="margin-left: 5px">{{ userInfo.email }}</span>
                            </el-text>
                            <el-button link type="primary" @click="onUpdateEmail()">修改</el-button>
                        </span>
                    </div>
                    <div class="line-row">
                        <el-text class="title">登录密码</el-text>
                        <el-text class="value">
                            <el-icon class="success-color"><SuccessFilled /></el-icon>
                            <span style="margin-left: 5px">{{ userInfo.password }}</span>
                        </el-text>
                        <el-button link type="primary" @click="onChangePassword()">修改</el-button>
                    </div>
                    <div class="line-row">
                        <el-text class="title">虚拟MFA</el-text>
                        <span v-if="userInfo.vmfa">
                            <el-text class="value">
                                <el-icon class="success-color"><SuccessFilled /></el-icon>
                                <span style="margin-left: 5px">已绑定</span>
                            </el-text>
                            <el-button link type="primary" @click="onResetVmfa()" disabled>重置</el-button>
                        </span>
                        <span v-else>
                            <el-text class="value">
                                <el-icon class="warning-color"><WarningFilled /></el-icon>
                                <span style="margin-left: 5px">未绑定</span>
                            </el-text>
                            <el-button link type="primary" @click="onOpenBindVmfa()" disabled>绑定</el-button>
                        </span>
                    </div>
                    <el-text class="title">登录保护</el-text>
                    <span v-if="userInfo.sip === 'ON'">
                        <el-text class="value">
                            <el-icon class="success-color"><SuccessFilled /></el-icon>
                            <span style="margin-left: 5px">已开启</span>
                        </el-text>
                        <el-button link type="primary" @click="onSwitchSip()">关闭</el-button>
                    </span>
                    <span v-else>
                        <el-text class="value">
                            <el-icon class="warning-color"><WarningFilled /></el-icon>
                            <span style="margin-left: 5px">未开启</span>
                        </el-text>
                        <el-button link type="primary" @click="onSwitchSip()">开启</el-button>
                    </span>

                    <el-divider style="margin-top: 20px; margin-bottom: 20px" content-position="left">注销账号</el-divider>
                    <div style="margin-left: 100px; width: 800px">
                        <el-text>{{ cancelmsg }}</el-text>
                    </div>
                    <div style="margin-left: 100px; margin-top: 10px; width: 800px">
                        <el-button plain size="small" disabled>关闭账号(暂不支持)</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
    <!-- 绑定vmfa开始 -->
    <el-dialog v-model="dialogVisible" :close-on-click-modal="false" title="绑定VMFA" width="500">
        <div style="display: flex; position: relative">
            <div>
                <el-form :model="form" label-width="auto">
                    <el-form-item label="使用虚拟MFA程序扫描二维码">
                        <vue-qr :text="vmfaUrl" :correctLevel="3"></vue-qr>
                    </el-form-item>
                    <el-form-item label="获取动态码并输入">
                        <el-input v-model="form.bindVmfaCaptcha" placeholder="6位数字验证码" />
                    </el-form-item>
                    <el-form-item label="点击按钮绑定">
                        <el-button style="width: 100%" type="primary" @click="onBindVmfa()">绑定VMFA设备</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </el-dialog>
    <!-- 绑定vmfa结束 -->
</template>

<script>
import { QuestionFilled, WarningFilled, SuccessFilled } from "@element-plus/icons-vue";
import { formatTime } from "@/utils/date.js";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
import { basicInfo, CreateVmfa, BindVmfa } from "@/api/index.js";
export default {
    name: "UserCenterIndex",
    components: {
        vueQr,
        QuestionFilled,
        WarningFilled,
        SuccessFilled,
    },
    data() {
        return {
            userInfo: {
                email: "",
                mobile: "",
                password: "",
            },
            cancelmsg:
                "如果您不再使用此账号，可以将其注销，账号注销后，数据会被删除且无法恢复。\
            注销包括关闭账号、注销账号两步。关闭账号24小时后，再点击注销账号，以便永久注销。",
            vmfa: false, // 用于显示vmfa是否绑定
            dialogVisible: false, // 绑定vmfa的弹窗
            vmfaUrl: "",
            form: {
                bindVmfaCaptcha: "",
            },
            timeoutId: null,
            loading: true,
        };
    },
    computed: {},
    watch: {},
    created() {
        this.onRefresh();
        this.$globalBus.emit("updateActivePath", "/accountInfo");
    },
    methods: {
        formatDate(time) {
            return formatTime(time);
        },
        GetbasicInfo: function () {
            basicInfo()
                .then((res) => {
                    this.userInfo = res.payload.userinfo;
                    this.userInfo.password = "●●●●●●●●●";
                    this.loading = false;
                })
                .catch(() => {});
        },
        CreateVmfa: async function () {
            const res = await CreateVmfa();
            this.vmfaUrl = res.payload.vmfa.totp.url;
            this.dialogVisible = true; // 打开绑定vmfa对话框
        },
        BindVmfa: function () {
            const data = {
                vmfa: { totp: { captcha: this.form.bindVmfaCaptcha } },
            };
            BindVmfa(data)
                .then(() => {
                    this.$notify({ title: "绑定成功", duration: 2000, type: "success" });
                    this.dialogVisible = false;
                    this.onRefresh();
                })
                .catch((err) => {
                    let msg = err.data.metadata;
                    console.log(err);
                    this.$notify({ title: "绑定失败", duration: 9000, message: msg, type: "warning" });
                });
        },
        onRefresh() {
            this.loading = true;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.GetbasicInfo();
            }, 350);
        },
        onOpenBindVmfa() {
            this.CreateVmfa();
        },
        onBindVmfa() {
            this.BindVmfa();
        },
        onResetVmfa() {
            //解绑vmaf按钮
            this.$router.push({ name: "safety", query: { type: "vmfa" } });
        },
        onChangePassword() {
            // 修改密码按钮
            this.$router.push({ name: "safety", query: { type: "password" } });
        },
        onUpdateEmail() {
            /// 更新或绑定邮箱
            this.$router.push({ name: "safety", query: { type: "email" } });
        },
        onSwitchSip() {
            this.$router.push({ name: "safety", query: { type: "sip" } });
        },
    },
};
</script>

<style scoped lang="less">
.title {
    display: inline-block;
    width: 120px;
    margin-left: 100px;
    margin-right: 5px;
    margin-bottom: 5px;
    margin-top: 5px;
}
.value {
    display: inline-block;
    width: 230px;
}
.line-row {
    margin-bottom: 0px;
}
.success-color {
    color: #5cb300;
}
.warning-color {
    color: #ffb700;
}
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
