<template>
    <div>
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :title="vdata.title" width="700">
            <div style="width: 100%; display: flex; justify-content: center; padding-bottom: 16px">
                <div style="width: 85%">
                    <div style="text-align: center">
                        <h3 style="margin-top: 0px"><el-text type="danger">为了您的账号安全，请完成以下验证。</el-text></h3>
                    </div>
                    <el-form :model="fromData" label-width="auto" label-position="left">
                        <el-form-item label="请选择验证方式">
                            <el-select v-model="fromData.device">
                                <el-option
                                    v-for="item in devices"
                                    :key="item.name"
                                    :label="item.title"
                                    :value="item.name"
                                    :disabled="item.disabled"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="请输入验证码" style="margin-bottom: 0px">
                            <div style="width: 100%; display: flex; align-items: center">
                                <div style="width: 100%">
                                    <el-input v-model="fromData.captcha" :placeholder="inputShow" @input="checkInput"></el-input>
                                </div>
                                <div v-if="fromData.device === 'email' || fromData.device === 'mobile'">
                                    <el-button plain style="margin-left: 15px" :disabled="GetCaptchaDisabled" @click="onSendCaptcha()">{{
                                        buttonTitle.GetCaptcha
                                    }}</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <div class="messages">
                            <el-text :type="messages.type">{{ messages.text }}</el-text>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center">
                            <el-button style="width: 48%" @click="onCance()">取消</el-button>
                            <el-button type="primary" style="width: 48%" :disabled="NextStepDisabled" @click="onSubmit()">
                                {{ vdata.submitTxt }}
                            </el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { GetSecurityDevice, GetCaptcha, VerifyCaptcha } from "@/api/index.js";
import { ShutAccount, RevocationShut, CancelAccount } from "@/api/index.js";
export default {
    name: "CancelAccount",
    props: {
        vdata: {
            title: "xxx",
        },
    },
    data() {
        return {
            dialogVisible: false,
            devices: "", // 用户绑定的所有验证设备
            noDevicesMessage: false,
            countdownTimer: null,
            GetCaptchaDisabled: false,
            NextStepDisabled: true,
            inputShow: "",
            fromData: {
                device: "", // 用户选择的验证设备
                captcha: "", // 用户输入的验证码
            },
            buttonTitle: {
                GetCaptcha: "点击获取验证码",
            },
            messages: {
                type: "",
                text: " ",
            },
            captcha: {
                serial: "",
            },
        };
    },
    methods: {
        ProcessSecurityDevice(data) {
            data.map((item) => {
                if (item.name === "vmfa") {
                    item["title"] = `虚拟MFA验证（${item.value}）`;
                }
                if (item.name === "email") {
                    item["title"] = `邮箱验证（${item.value}）`;
                }
                if (item.name === "mobile") {
                    item["title"] = `手机验证（${item.value}）`;
                    item["disabled"] = true;
                }
                this.inputShow = "请输入6位数字验证码";
            });
            if (data.length === 0) {
                this.noDevicesMessage = true;
            }
            if (this.fromData.device === "" && data.length !== 0) {
                this.fromData.device = data[0].name;
            }
            this.devices = data;
        },
        loadGetSecurityDevice: function () {
            GetSecurityDevice()
                .then((res) => {
                    const devices = res.payload.devices;
                    this.ProcessSecurityDevice(devices);
                })
                .catch(() => {});
        },
        checkInput() {
            let captcha = this.fromData.captcha;
            if (captcha === "" || captcha.length !== 6) {
                this.NextStepDisabled = true;
                return;
            }
            if (captcha !== "" && captcha.length === 6) {
                this.NextStepDisabled = false;
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
        loadGetCaptcha: function () {
            // 获取验证码
            const paths = { schema: this.fromData.device };
            GetCaptcha(paths)
                .then((res) => {
                    this.messages = {
                        type: "success",
                        text: `验证码发送成功（10内分钟有效）。验证码编号：${res.payload.captcha.serial}`,
                    };
                    this.captcha = {
                        serial: res.payload.captcha.serial,
                    };
                })
                .catch((err) => {
                    let msg = err.data.metadata.message;
                    this.messages = {
                        type: "danger",
                        text: "验证码发送失败，请稍后重试。" + msg,
                    };
                });
        },
        // 发送验证码
        onSendCaptcha() {
            this.GetCaptchaDisabled = true;
            this.startCountdown(60); // 倒计时功能，用于更新获取验证码按钮的提示信息
            this.loadGetCaptcha();
        },
        // 校验验证码
        loadVerifyCaptcha: function (key) {
            const patch = { schema: this.fromData.device };
            const data = { captcha: this.fromData.captcha, key: key };
            VerifyCaptcha(patch, data)
                .then(() => {
                    this.messages = {
                        type: "success",
                        text: "验证成功，正在处理。",
                    };
                    this.onNextStep();
                    this.$parent.onRefresh();
                })
                .catch((e) => {
                    this.messages = {
                        type: "danger",
                        text: "验证码已失效，请点击重新获取。",
                    };
                    console.log(e);
                });
        },
        // 下一步操作关闭账号
        onNextStep() {
            // 根据状态选择不同的操作：关闭账号，撤销关闭，注销账号
            switch (this.vdata.mark) {
                case "shut":
                    //关闭账号
                    ShutAccount()
                        .then(() => {
                            this.dialogVisible = false;
                        })
                        .catch((err) => {
                            this.messages = {
                                type: "danger",
                                text: err.data.metadata.message,
                            };
                        });
                    break;
                case "revocation":
                    //撤销关闭
                    RevocationShut()
                        .then(() => {
                            this.dialogVisible = false;
                        })
                        .catch((err) => {
                            this.messages = {
                                type: "danger",
                                text: err.data.metadata.message,
                            };
                        });
                    break;
                case "cancel":
                    // 注销账号
                    CancelAccount()
                        .then(() => {
                            this.dialogVisible = false;
                        })
                        .catch((err) => {
                            this.messages = {
                                type: "danger",
                                text: err.data.metadata.message,
                            };
                        });
                    break;
                default:
                    this.dialogVisible = false;
            }
        },
        onSubmit() {
            this.loadVerifyCaptcha(this.vdata.captchaKey);
        },
        openDeleteUserDialog() {
            // 初始化表单字段
            this.buttonTitle = { GetCaptcha: "点击获取验证码" };
            this.messages = { type: "", text: " " };
            this.captcha = { serial: "" };
            this.fromData = { device: "", captcha: "" }; // 清除上次输入的验证码
            clearInterval(this.countdownTimer); // 清除定时器
            this.GetCaptchaDisabled = false; // 启用按钮
            this.dialogVisible = true; // 打开弹窗
        },
        onCance() {
            this.dialogVisible = false;
        },
    },
    created() {
        this.loadGetSecurityDevice();
    },
};
</script>

<style>
.text-row {
    background-color: #ffdba5;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 10px;
    border-radius: 8px;
}
.messages {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 20px;
    margin-bottom: 8px;
    margin-top: 8px;
}
</style>
