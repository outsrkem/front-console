<template>
    <div>
        <el-card>
            <div class="basic-info">
                <el-divider style="margin-top: 20px; margin-bottom: 20px" content-position="left">账号安全信息</el-divider>
                <div class="line-row">
                    <el-text class="title">账号名</el-text>
                    <el-text class="value">{{ userInfo.account }}</el-text>
                </div>
                <div class="line-row">
                    <el-text class="title">姓名</el-text>
                    <el-text class="value">{{ userInfo.username }}</el-text>
                    <!-- <el-button link type="primary" disabled>修改</el-button> -->
                </div>
                <div class="line-row">
                    <el-text class="title">手机号码</el-text>
                    <span v-if="userInfo.mobile === ''">
                        <el-text class="value">未绑定</el-text>
                        <!-- <el-button link type="primary" disabled>绑定</el-button> -->
                    </span>
                    <span v-else>
                        <el-text class="value">{{ userInfo.mobile }}</el-text>
                        <!-- <el-button link type="primary" disabled>修改</el-button> -->
                    </span>
                </div>
                <div class="line-row">
                    <el-text class="title">邮箱号码</el-text>
                    <span v-if="userInfo.email === ''">
                        <el-text class="value">未绑定</el-text>
                        <el-button link type="primary" @click="onUpdateEmail()">绑定</el-button>
                    </span>
                    <span v-else>
                        <el-text class="value">{{ userInfo.email }}</el-text>
                        <el-button link type="primary" @click="onUpdateEmail()">修改</el-button>
                    </span>
                </div>
                <div class="line-row">
                    <el-text class="title">登录密码</el-text>
                    <el-text class="value">****************</el-text>
                    <el-button link type="primary" @click="onChangePassword()">修改</el-button>
                </div>
                <div class="line-row">
                    <el-text class="title">虚拟MFA</el-text>
                    <span v-if="vmfa">
                        <el-text class="value">已绑定</el-text>
                        <el-button link type="primary" @click="onResetVmfa()">重置</el-button>
                    </span>
                    <span v-else>
                        <el-text class="value">未绑定</el-text>
                        <el-button link type="primary" @click="onOpenBindVmfa()">绑定</el-button>
                    </span>
                </div>
                <el-text class="title">登录保护</el-text>
                <span v-if="userInfo.sip === 'ON'">
                    <el-text class="value">已开启</el-text>
                    <el-button link type="primary" @click="onSwitchSip()">关闭</el-button>
                </span>
                <span v-else>
                    <el-text class="value">未开启</el-text>
                    <el-button link type="primary" @click="onSwitchSip()">开启</el-button>
                </span>
                <el-divider style="margin-top: 20px; margin-bottom: 20px" content-position="left">基础信息</el-divider>
                <div class="line-row">
                    <el-text class="title">注册时间</el-text>
                    <el-text class="value">{{ formatDate(userInfo.create_time) }}</el-text>
                </div>
                <div class="line-row">
                    <el-text class="title">最近登录时间</el-text>
                    <el-text class="value">{{ formatDate(userInfo.last_login_at) }}</el-text>
                </div>
                <el-divider style="margin-top: 20px; margin-bottom: 20px" content-position="left">注销账号</el-divider>
                <div style="margin-left: 100px; width: 800px">
                    <el-text>{{ cancelmsg }}</el-text>
                </div>
                <div style="margin-left: 100px; margin-top: 10px; width: 800px">
                    <el-button plain size="small" disabled>关闭账号(暂不支持)</el-button>
                </div>
            </div>
        </el-card>
    </div>
    <!-- 绑定vmfa开始 -->
    <el-dialog v-model="dialogVisible" :close-on-click-modal="false" title="绑定VMFA" width="500">
        <div style="display: flex; position: relative">
            <div>
                <el-form :model="form" label-width="auto">
                    <el-form-item label="使用MFA程序扫描二维码">
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
import { formatTime } from "@/utils/date.js";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
import { basicInfo, GetSecurityDevice, CreateVmfa, BindVmfa } from "@/api/index.js";
export default {
    name: "UserCenterIndex",
    components: {
        vueQr,
    },
    data() {
        return {
            userInfo: {},
            cancelmsg:
                "如果您不再使用此账号，可以将其注销，账号注销后，数据会被删除且无法恢复。\
            注销包括关闭账号、注销账号两步。关闭账号24小时后，再点击注销账号，以便永久注销。",
            vmfa: false, // 用于显示vmfa是否绑定
            dialogVisible: false, // 绑定vmfa的弹窗
            vmfaUrl: "",
            form: {
                bindVmfaCaptcha: "",
            },
        };
    },
    computed: {},
    watch: {},
    created() {
        this.GetbasicInfo();
        this.GetGetSecurityDevice();
    },
    methods: {
        formatDate(time) {
            return formatTime(time);
        },
        GetbasicInfo: function () {
            basicInfo()
                .then((res) => {
                    this.userInfo = res.payload.userinfo;
                })
                .catch(() => {});
        },
        GetGetSecurityDevice: function () {
            GetSecurityDevice().then((res) => {
                const devices = res.payload.devices;
                devices.some((item) => {
                    if (item.device === "vmfa") {
                        this.vmfa = true;
                        return true;
                    } else {
                        this.vmfa = false;
                        return false;
                    }
                });
            });
        },
        CreateVmfa: async function () {
            const res = await CreateVmfa();
            this.vmfaUrl = res.payload.vmfa.totp.url;
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
                    this.$notify({ title: "绑定失败", duration: 9000, message: msg, type: "warning" });
                });
        },
        onRefresh() {
            this.GetbasicInfo();
            this.GetGetSecurityDevice();
        },
        onOpenBindVmfa() {
            this.CreateVmfa();
            this.dialogVisible = true;
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
    width: 300px;
}
.line-row {
    margin-bottom: 0px;
}
</style>
