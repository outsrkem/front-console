<template>
    <div style="width: 100%; display: flex; justify-content: center">
        <div style="width: 42%">
            <div style="text-align: center">
                <h5>重置虚拟MFA设备</h5>
                <el-text>{{ titleText }}</el-text>
            </div>
            <div v-if="page1" style="margin-top: 18px">
                <el-form :model="fromData" label-width="auto" label-position="left">
                    <div style="display: flex; justify-content: center; width: 100%; margin-bottom: 18px">
                        <el-text size="large" type="danger">您确定要重置虚拟MFA设备吗？</el-text>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center">
                        <el-button style="width: 100px" @click="onCance()">取消</el-button>
                        <el-button style="width: 100px" type="primary" @click="onSubmit()">确认</el-button>
                    </div>
                </el-form>
            </div>
            <div v-if="page2">
                <div style="display: flex; justify-content: center; align-items: center">
                    <el-col :sm="12" :lg="12">
                        <el-result icon="success" sub-title="重置虚拟MFA设备成功">
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
import { ResetVmfa } from "@/api/index.js";
export default {
    name: "VmfaIndex",
    data() {
        return {
            page1: true,
            page2: false,
            fromData: {},
            titleText:
                "虚拟MFA是能产生6位数字认证码的设备，遵循基于时间的一次性密码 （TOTP）标准。\
                MFA设备可以基于硬件也可以基于软件，目前仅支持基于软件的虚拟MFA，\
                即虚拟MFA应用程序，可以在移动智能手机上运行，非常方便，虚拟MFA是多因素认证方式中的一种。",
        };
    },
    methods: {
        loadResetVmfa: function () {
            ResetVmfa()
                .then(() => {
                    this.page1 = false;
                    this.page2 = true;
                    this.$emit("call-parent");
                })
                .catch((err) => {
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "解绑失败", message: msg, type: "error" });
                });
        },
        onCance() {
            this.$router.push({ name: "userCenter" });
        },
        onSubmit() {
            // 修改密码确认按钮
            this.$emit("call-parent");
            this.loadResetVmfa();
        },
    },
};
</script>

<style></style>
