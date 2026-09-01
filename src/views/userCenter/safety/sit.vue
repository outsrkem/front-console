<template>
    <el-dialog v-model="dialogVisible" :close-on-click-modal="false" title="会话空闲超时设置" width="500px">
        <div v-loading="submitLoading">
            <div>
                <el-text>
                    <p style="margin: 5px 0">该时间内无操作，系统保持登录状态。设置成功后，下次登录生效。</p>
                    <p style="margin: 5px 0">设置区间：15分钟~24小时</p>
                </el-text>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 20px 0">
                <el-select v-model="hourVal" placeholder="" filterable allow-create clearable style="width: 100px">
                    <el-option v-for="h in 25" :key="h" :label="h - 1" :value="h - 1" />
                </el-select>
                <span>小时</span>
                <el-select v-model="minuteVal" placeholder="" filterable allow-create clearable style="width: 100px">
                    <el-option v-for="m in [0, 15, 30, 45]" :key="m" :label="m" :value="m" />
                </el-select>
                <span>分钟</span>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px">
                <el-button style="width: 120px" @click="dialogVisible = false">取消</el-button>
                <el-button style="width: 120px" type="primary" @click="onSubmit">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { ElMessage } from "element-plus";
import { UpdateUserInfo } from "../../../api/index.js";
import { withDelay } from "../../../utils/common.js";
import { msgcon } from "../../../utils/message.js";
export default {
    name: "SitIndex",
    props: {
        // Receive format xxhxxm / xxh / xxm from parent component
        idleTimeoutStr: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            dialogVisible: false,
            hourVal: 0,
            minuteVal: 15,
            submitLoading: false,
        };
    },
    methods: {
        // Parse time string such as 1h30m / 2h / 45m to hour and minute
        parseTimeStr(str) {
            let hour = 0;
            let minute = 0;
            if (!str) {
                return { hour, minute };
            }
            const hMatch = str.match(/([0-9]+)h/);
            if (hMatch) {
                hour = Number(hMatch[1]);
            }
            const mMatch = str.match(/([0-9]+)m/);
            if (mMatch) {
                minute = Number(mMatch[1]);
            }
            return { hour, minute };
        },
        OpenSitDialog() {
            this.submitLoading = false;
            const { hour, minute } = this.parseTimeStr(this.idleTimeoutStr);
            this.hourVal = hour;
            this.minuteVal = minute;
            this.dialogVisible = true;
        },
        onCance() {
            this.dialogVisible = false;
        },
        async onSubmit() {
            const hour = Number(this.hourVal);
            const minute = Number(this.minuteVal);
            if (isNaN(hour) || isNaN(minute)) {
                ElMessage.warning(msgcon("小时、分钟请输入有效数字"));
                return;
            }
            if (hour < 0 || minute < 0) {
                ElMessage.warning(msgcon("小时、分钟不能为负数"));
                return;
            }
            const totalMin = hour * 60 + minute;
            const MIN = 15;
            const MAX = 24 * 60; //24 hours
            if (totalMin < MIN) {
                ElMessage.warning(msgcon("设置时间不能小于15分钟"));
                return;
            }
            if (totalMin > MAX) {
                ElMessage.warning(msgcon("设置时间不能大于24小时"));
                return;
            }

            let timeStr = "";
            if (hour > 0) {
                timeStr += `${hour}h`;
            }
            if (minute > 0) {
                timeStr += `${minute}m`;
            }
            const data = { session_idle_timeout: timeStr };

            this.submitLoading = true;
            try {
                await withDelay(() => UpdateUserInfo(data), 800);
                this.dialogVisible = false;
                ElMessage.success(msgcon("会话超时设置成功,下次登录生效"));
                this.$emit("update:idleTimeoutStr", timeStr);
            } catch (err) {
                ElMessage.error(msgcon("设置失败，请稍后重试"));
            } finally {
                this.submitLoading = false;
            }
        },
    },
};
</script>
