<template>
    <div style="width: 100%; display: flex; justify-content: center">
        <div style="width: 42%">
            <div style="text-align: center">
                <h5>有效的邮箱，可以用于重置密码，开启登录验证</h5>
            </div>
            <div v-if="page1" style="margin-top: 18px">
                <el-form :model="formData" label-width="auto" label-position="left" :rules="formRules" :hide-required-asterisk="true">
                    <el-form-item label="新邮箱地址" prop="email">
                        <el-input v-model="formData.email" :placeholder="messages.email" />
                    </el-form-item>
                    <el-form-item label="邮箱验证码" prop="captcha" style="margin-bottom: 0px">
                        <div style="width: 100%; display: flex; align-items: center">
                            <div style="width: 100%">
                                <el-input v-model="formData.captcha" placeholder="6位数字验证码" />
                            </div>
                            <div>
                                <el-button plain style="margin-left: 15px" :disabled="GetCaptchaDisabled" @click="onSendCaptcha()">{{
                                    buttonTitle.GetCaptcha
                                }}</el-button>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="messages">
                    <el-text :type="messages.type">{{ messages.text }}</el-text>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center">
                    <el-button style="width: 48%" @click="onCance()">取消</el-button>
                    <el-button style="width: 48%" type="primary" :disabled="SubmitDisabled" @click="onSubmit()">确认修改邮箱</el-button>
                </div>
            </div>
            <div v-if="page2">
                <div style="display: flex; justify-content: center; align-items: center">
                    <el-col :sm="12" :lg="12">
                        <el-result icon="success" sub-title="邮箱设置成功">
                            <template #extra>
                                <el-button size="small" type="primary" @click="onCance()">确定</el-button>
                            </template>
                        </el-result>
                    </el-col>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { basicInfo, SendCaptcha, SetMail } from "@/api/index.js";
export default {
    name: "EmailIndex",
    data() {
        return {
            page1: true,
            page2: false,
            SubmitDisabled: false,
            formData: {
                email: "",
                captcha: "",
            },
            GetCaptchaDisabled: false,
            buttonTitle: {
                GetCaptcha: "点击获取验证码",
            },
            countdownTimer: null, //定时器
            messages: {
                type: "",
                text: "",
                email: "",
            },
            formRules: {
                email: [
                    { type: "string", required: true, message: "", trigger: ["blur"] },
                    { type: "email", message: "", trigger: ["blur", "change"] },
                ],
                captcha: [
                    { type: "string", required: true, message: "", trigger: ["blur"] },
                    { type: "string", pattern: /^[0-9]{6}$/, message: "", trigger: ["blur", "change"] },
                ],
            },
        };
    },
    methods: {
        GetbasicInfo: function () {
            basicInfo()
                .then((res) => {
                    const email = res.payload.userinfo.email;
                    this.messages.email = `邮箱地址（必填）。原邮箱地址：${email}`;
                })
                .catch(() => {});
        },
        loadSendCaptcha: function () {
            // 创建邮箱验证码
            const data = { variety: "email", value: this.formData.email };
            SendCaptcha(data)
                .then((res) => {
                    this.messages = {
                        type: "success",
                        text: `验证码发送成功（10内分钟有效）。验证码编号：${res.payload.captcha.serial}`,
                    };
                })
                .catch((err) => {
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "发送失败", message: msg, type: "error" });
                });
        },
        loadSetMail: function () {
            const data = { email: this.formData.email, captcha: this.formData.captcha };
            SetMail(data)
                .then(() => {
                    this.page1 = false;
                    this.page2 = true;
                    this.$emit("call-parent");
                })
                .catch((err) => {
                    this.SubmitDisabled = false;
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "操作失败", message: msg, type: "error" });
                });
        },
        onSendCaptcha() {
            // 获取新邮箱验证码
            const email = this.formData.email;
            if (email === "") {
                this.$notify({ duration: 5000, title: "您没有输入邮箱", type: "error" });
                return;
            }
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                this.$notify({ duration: 5000, title: "邮箱格式不正确", type: "error" });
                return;
            }
            this.GetCaptchaDisabled = true;
            this.startCountdown(60); // 倒计时功能，用于更新获取验证码按钮的提示信息
            this.loadSendCaptcha();
        },
        onCance() {
            // 返回用户中心
            this.$router.push({ name: "userCenter" });
        },
        onSubmit() {
            // 确认按钮
            const captcha = this.formData.captcha;
            if (captcha === "") {
                this.$notify({ duration: 5000, title: "您没有输入验证码", type: "error" });
                return;
            }
            if (!/^[0-9]{6}$/.test(captcha)) {
                this.$notify({ duration: 5000, title: "输入的不是6位数字", message: "", type: "error" });
                return;
            }
            this.$emit("call-parent");
            this.SubmitDisabled = true;
            this.loadSetMail();
        },
        startCountdown(seconds = 60) {
            // 定时器
            if (seconds <= 0) {
                clearInterval(this.countdownTimer); // 清除定时器
                this.GetCaptchaDisabled = false; // 启用按钮
                this.buttonTitle.GetCaptcha = "重新获取验证码"; // 恢复按钮文本
                return;
            }
            this.buttonTitle.GetCaptcha = `${seconds}秒后重新获取`;
            this.countdownTimer = setTimeout(() => {
                this.startCountdown(seconds - 1);
            }, 1000);
        },
    },
    created() {
        this.GetbasicInfo();
    },
};
</script>

<style scoped lang="less">
.messages {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 20px;
    margin-bottom: 8px;
    margin-top: 8px;
}
</style>
