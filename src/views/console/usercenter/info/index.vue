<template>
    <div class="settings-container">
        <el-card class="box-card">
            <div style="height: 100%;">
                <div>
                    <h4>
                        <p style="margin-left: 99px;">基本信息</p>
                    </h4>
                </div>
                <div>
                    <div class="basic-info">
                        <div class="label">账号名</div>
                        <div style="width: 300px;">{{userInfo.account}}</div>
                    </div>
                    <div class="basic-info">
                        <div class="label">姓名</div>
                        <div style="width: 300px;">{{userInfo.username}}</div>
                        <!-- <a>修改</a> -->
                    </div>
                    <div class="basic-info">
                        <div class="label">手机号码</div>
                        <div style="width: 300px;">{{userInfo.mobile}}</div>
                        <!-- <a>修改</a> -->
                    </div>
                    <div class="basic-info">
                        <div class="label">邮箱号码</div>
                        <div style="width: 300px;">{{userInfo.email}}</div>
                        <!-- <a>修改</a> -->
                    </div>
                    <div class="basic-info">
                        <div class="label">注册时间</div>
                        <div style="width: 300px;">{{formatDate(userInfo.create_time)}}</div>
                    </div>
                    <div class="basic-info">
                        <div class="label">上次登录时间</div>
                        <div style="width: 300px;">{{formatDate(userInfo.last_login_at)}}</div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
        
<script>
import { formatTime } from '@/utils/date.js'
import { basicInfo } from '@/api/index.js'
export default {
name: 'AccountInfoIndex',
    data() {
        return {
            userInfo: {}
        }
    },
    methods: {
        GetbasicInfo: async function () {
            const res = await basicInfo()
            this.userInfo = res.payload.userinfo
        },
        formatDate(time) {
            return formatTime(time)
        },
    },
    created() {
        this.GetbasicInfo()
    }
    
}
</script>
        
<style scoped lang="less">
    .basic-info{
        margin-left: 99px;
        display: flex; 
        padding-top: 10px; 
        padding-bottom: 10px;
        .label{
            width: 150px;
            color: #808080;
        }
    }
</style>
        
  