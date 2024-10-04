<template>
    <div style="width: 100%; display: flex; justify-content: center">
        <div style="width: 42%">
            <div style="text-align: center">
                <h5>登录保护设置</h5>
                <el-text>开启登录保护，可以有效地保护您的账号安全</el-text>
            </div>
            <div v-if="page1" style="margin-top: 18px">
                <el-form label-width="auto" label-position="left" size="large">
                    <el-form-item label="登录保护">
                        <el-radio-group v-model="sipstate">
                            <el-radio value="ON">开启（登录时需要先验证您的身份）</el-radio>
                            <el-radio value="OFF">关闭（登录时无需身份验证即可登录）</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div style="display: flex; justify-content: flex-end">
                    <el-button style="width: 100px" @click="onCance()">取消</el-button>
                    <el-button style="width: 100px" type="primary" :disabled="SubmitDisabled" @click="onSubmit()">确认</el-button>
                </div>
            </div>
            <div v-if="page2">
                <div style="display: flex; justify-content: center; align-items: center">
                    <el-col :sm="12" :lg="12">
                        <el-result icon="success" sub-title="登录保护设置成功">
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
import { basicInfo, ToggleSip } from "@/api/index.js";
export default {
    name: "SipIndex",
    data() {
        return {
            page1: true,
            page2: false,
            sipstate: "",
            SubmitDisabled: false,
            formData: "",
        };
    },
    methods: {
        GetbasicInfo: function () {
            basicInfo()
                .then((res) => {
                    this.sipstate = res.payload.userinfo.sip;
                })
                .catch(() => {});
        },
        loadToggleSip: function () {
            const data = { enabled: this.sipstate === "ON" ? true : false };
            ToggleSip(data)
                .then(() => {
                    this.page1 = false;
                    this.page2 = true;
                    this.$emit("call-parent");
                })
                .catch((err) => {
                    let msg = err.data.metadata.message;
                    this.$notify({ duration: 5000, title: "操作失败", message: msg, type: "error" });
                });
        },
        onCance() {
            this.$router.push({ name: "userCenter" });
        },
        onSubmit() {
            if (this.sipstate === "") {
                this.$notify({ duration: 5000, title: "您没有选择开启或关闭", type: "error" });
                return;
            }
            this.$emit("call-parent");
            this.loadToggleSip();
        },
    },
    created() {
        this.GetbasicInfo();
    },
};
</script>

<style></style>
