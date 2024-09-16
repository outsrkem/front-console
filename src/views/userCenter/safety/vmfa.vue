<template>
    <div style="width: 100%; display: flex; justify-content: center">
        <div style="width: 42%">
            <div style="text-align: center">
                <h5 style="margin-bottom: 0px; margin-top: 0px">解绑VMFA设备</h5>
                <h5></h5>
            </div>
            <div v-if="page1">
                <el-form :model="fromData" label-width="auto" label-position="left">
                    <div style="display: flex; justify-content: center; width: 100%; margin-bottom: 18px">
                        <el-text size="large" type="danger">您确定要解绑VMFA设备吗？</el-text>
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center">
                        <el-button style="width: 100px" @click="onCance()">取消</el-button>
                        <el-button style="width: 100px" type="primary" @click="onSubmit()">确认</el-button>
                    </div>
                </el-form>
            </div>
            <div v-if="page2">
                <div style="display: flex; justify-content: center; align-items: center">
                    <el-button type="primary" plain @click="onCance()">解绑成功，点击按钮返回个人中心</el-button>
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
        };
    },
    methods: {
        loadResetVmfa: function () {
            ResetVmfa()
                .then(() => {
                    this.page1 = false;
                    this.page2 = true;
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
            this.loadResetVmfa();
        },
    },
};
</script>

<style></style>
