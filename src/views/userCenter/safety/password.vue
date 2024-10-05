<template>
    <div style="width: 100%; display: flex; justify-content: center">
        <div style="width: 42%">
            <div style="text-align: center">
                <h5>设置新密码</h5>
                <el-text>定期修改密码可以使您的账号更安全</el-text>
            </div>
            <div v-if="page1" style="margin-top: 18px">
                <el-form :model="fromData" label-width="auto" label-position="left">
                    <el-form-item label="新密码">
                        <el-input v-model="fromData.pass1" placeholder="请输入新密码" @input="checkPass" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="确认新密码">
                        <el-input v-model="fromData.pass2" placeholder="请再次输入新密码" @input="checkPass" type="password" show-password />
                    </el-form-item>
                    <div style="display: flex; justify-content: center; width: 100%; margin-bottom: 18px">
                        <el-text :type="messages.type">{{ messages.text }}</el-text>
                    </div>
                    <div style="display: flex; justify-content: flex-end">
                        <el-button style="width: 100px" @click="onCance()">取消</el-button>
                        <el-button style="width: 100px" type="primary" :disabled="SubmitDisabled" :loading="SubmitLoading" @click="onSubmit()"
                            >确认</el-button
                        >
                    </div>
                </el-form>
            </div>
            <div v-if="page2">
                <div style="display: flex; justify-content: center; align-items: center">
                    <el-col :sm="12" :lg="12">
                        <el-result icon="success" sub-title="新密码设置成功">
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
import { SetPasswd } from "@/api/index.js";
export default {
    name: "PasswordIndex",
    props: {
        vmodel: Object,
        default: () => ({}),
    },
    data() {
        return {
            fromData: {
                pass1: "",
                pass2: "",
            },
            messages: {
                text: "",
                type: "",
            },
            SubmitDisabled: true, // 按钮状态，密码不对不让点
            SubmitLoading: false, // 按钮加载状态
            page1: true,
            page2: false,
        };
    },
    methods: {
        loadSetPasswd: function () {
            const data = { password: { value: this.fromData.pass1 } };
            SetPasswd(data)
                .then(() => {
                    this.page1 = false;
                    this.page2 = true;
                    this.$emit("call-parent");
                })
                .catch((err) => {
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "修改失败", message: msg, type: "error" });
                    this.SubmitLoading = false;
                });
        },
        checkPass() {
            const pass = this.fromData;
            if (pass.pass1 !== pass.pass2) {
                this.messages = {
                    type: "danger",
                    text: "两次输入的密码不一致。",
                };
                this.SubmitDisabled = true;
            } else {
                this.messages = {
                    type: "",
                    text: "",
                };
                this.SubmitDisabled = false;
            }
        },
        onCance() {
            this.$router.push({ name: "userCenter" });
        },
        onSubmit() {
            // 修改密码确认按钮
            const pass = this.fromData;
            if (pass.pass1 === pass.pass2 && pass.pass1 !== "") {
                this.SubmitLoading = true;
                this.$emit("call-parent");
                this.loadSetPasswd();
            }
        },
    },
};
</script>

<style></style>
