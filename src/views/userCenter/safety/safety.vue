<template>
    <div>
        <el-card>
            <div style="width: 100%; display: flex; justify-content: center">
                <div style="width: 100%">
                    <el-steps simple :active="steps.active" :finish-status="steps.status">
                        <el-step :title="title.step1" />
                        <el-step :title="title.step2" />
                        <el-step :title="title.step3" />
                    </el-steps>
                </div>
            </div>
            <div v-if="pages.step1" style="width: 100%; display: flex; justify-content: center">
                <div style="width: 42%">
                    <div style="text-align: center">
                        <h5>为确认是您本人操作，请完成以下验证。</h5>
                    </div>
                    <el-form :model="fromData" label-width="auto" label-position="left">
                        <el-form-item label="请选择验证方式">
                            <el-select v-model="fromData.device">
                                <el-option v-for="item in devices" :key="item.device" :label="item.title" :value="item.device" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="请输入验证码" style="margin-bottom: 0px">
                            <div style="width: 100%; display: flex; align-items: center">
                                <div style="width: 100%">
                                    <el-input v-model="fromData.captcha" :placeholder="inputShow" @input="checkInput" />
                                </div>
                                <div v-if="fromData.device === 'email' || fromData.device === 'mobile'">
                                    <el-button plain style="margin-left: 15px" :disabled="GetCaptchaDisabled" @click="onSendCaptcha()">{{
                                        buttonTitle.GetCaptcha
                                    }}</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <div style="display: flex; justify-content: center; width: 100%; margin-bottom: 18px">
                            <el-text :type="messages.type">{{ messages.text }}</el-text>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center">
                            <el-button style="width: 48%" @click="onCance()">取消</el-button>
                            <el-button type="primary" style="width: 48%" :disabled="NextStepDisabled" @click="onNextStep()">下一步</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
            <password-index v-if="pages.step2password" :vmodel="fromData" @call-parent="displayNextStep" />
            <vmfa-index v-if="pages.step2vmfa" @call-parent="displayNextStep" />
            <sip-index v-if="pages.step2sip" @call-parent="displayNextStep" />
            <email-index v-if="pages.step2email" @call-parent="displayNextStep" />
        </el-card>
    </div>
</template>

<script>
import PasswordIndex from "./password.vue";
import VmfaIndex from "./vmfa.vue";
import SipIndex from "./sip.vue";
import EmailIndex from "./email.vue";
import { GetSecurityDevice, GetCaptcha, VerifyCaptcha } from "@/api/index.js";
export default {
    name: "SafetyIndex",
    components: {
        PasswordIndex,
        VmfaIndex,
        SipIndex,
        EmailIndex,
    },
    data() {
        return {
            devices: "", // 用户绑定的所有验证设备
            fromData: {
                device: "", // 用户选择的验证设备
                captcha: "",
            },
            countdownTimer: null,
            GetCaptchaDisabled: false,
            NextStepDisabled: true,
            buttonTitle: {
                GetCaptcha: "点击获取验证码",
            },
            messages: {
                type: "",
                text: " ",
            },
            pages: {
                step1: true,
                step2password: false,
                step2vmfa: false,
                step2sip: false,
                step2email: false,
            },
            steps: {
                active: 0,
                status: "success",
            },
            inputShow: "",
            mtype: "", // 操作类型
            title: {
                step1: "安全验证",
                step2: "",
                step3: "完成",
            },
        };
    },
    methods: {
        ProcessSecurityDevice(data) {
            data.map((item) => {
                if (item.device === "email") {
                    item["title"] = `邮箱验证（${item.name}）`;
                }
                if (item.device === "mobile") {
                    item["title"] = `手机验证，暂不支持获取验证码（${item.name}）`;
                }
                if (item.device === "vmfa") {
                    item["title"] = `VMFA验证`;
                }
                if (item.device === "password") {
                    this.inputShow = "请输入密码";
                    item["title"] = `登录密码验证`;
                } else {
                    this.inputShow = "6位数字验证码";
                }
            });
            this.devices = data;
            if (this.fromData.device === "") {
                this.fromData.device = data[0].device;
            }
        },
        loadGetSecurityDevice: function () {
            GetSecurityDevice()
                .then((res) => {
                    const devices = res.payload.devices;
                    this.ProcessSecurityDevice(devices);
                })
                .catch(() => {});
        },
        loadGetCaptcha: function () {
            // 获取验证码
            const params = { variety: this.fromData.device };
            GetCaptcha(params)
                .then((res) => {
                    this.messages = {
                        type: "success",
                        text: `验证码发送成功。验证码编号：${res.payload.captcha.serial}`,
                    };
                })
                .catch(() => {
                    this.messages = {
                        type: "danger",
                        text: "验证码发送失败，请稍后重试。",
                    };
                });
        },
        loadVerifyCaptcha: function (key) {
            const patch = { schema: this.fromData.device };
            const data = { captcha: this.fromData.captcha, key: key };
            VerifyCaptcha(patch, data)
                .then(() => {
                    this.messages = {
                        type: "success",
                        text: "验证成功，正在处理。",
                    };

                    this.nextStep();
                })
                .catch(() => {
                    this.messages = {
                        type: "danger",
                        text: "验证码已失效，请点击重新获取。",
                    };
                });
        },
        displayNextStep() {
            if (this.steps.active < 3) {
                this.steps.active++;
            }
        },
        nextStep() {
            this.displayNextStep();
            switch (this.mtype) {
                case "password":
                    this.pages.step1 = false;
                    this.pages.step2password = true;
                    break;
                case "vmfa":
                    this.pages.step1 = false;
                    this.pages.step2vmfa = true;
                    break;
                case "sip":
                    this.pages.step1 = false;
                    this.pages.step2sip = true;
                    break;
                case "email":
                    this.pages.step1 = false;
                    this.pages.step2email = true;
                    break;
                default:
                // 与 case 1 和 case 2 不同时执行的代码
            }
        },
        onSendCaptcha() {
            this.GetCaptchaDisabled = true;
            this.startCountdown(60); // 倒计时功能，用于更新获取验证码按钮的提示信息
            this.loadGetCaptcha();
        },
        checkInput() {
            let captcha = this.fromData.captcha;
            if (this.fromData.device === "password") {
                // 没有绑定任何设备
                if (captcha.length > 2) {
                    this.NextStepDisabled = false;
                } else {
                    this.NextStepDisabled = true;
                }
                return;
            }
            if (captcha === "" || captcha.length !== 6) {
                this.NextStepDisabled = true;
                return;
            }
            if (captcha !== "" && captcha.length === 6) {
                this.NextStepDisabled = false;
                return;
            }
        },
        onCance() {
            this.$router.push({ name: "userCenter" });
        },
        onNextStep() {
            // 下一步按钮
            const type = this.mtype;
            if (type === "password") {
                this.nextStep();
                return;
            }
            if (type === "vmfa") {
                this.loadVerifyCaptcha("RESET_VMFA_DEVICES");
                return;
            }
            if (type === "sip") {
                this.loadVerifyCaptcha("TOGGLE_2FA_VERIFICATION");
                return;
            }
            if (type === "email") {
                this.loadVerifyCaptcha("SET_USER_EMAIL");
                return;
            }
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
        initTitle(val) {
            switch (val) {
                case "password":
                    this.title.step2 = "修改密码";
                    break;
                case "vmfa":
                    this.title.step2 = "重置vmfa";
                    break;
                case "sip":
                    this.title.step2 = "设置登录保护";
                    break;
                case "email":
                    this.title.step2 = "设置邮箱";
                    break;
                default:
                // 与 case 1 和 case 2 不同时执行的代码
            }
        },
    },
    created() {
        this.mtype = this.$route.query.type;
        this.initTitle(this.mtype);
        this.loadGetSecurityDevice();
        this.checkInput();
    },
};
</script>

<style></style>
