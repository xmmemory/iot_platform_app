<template>
    <view class="container">
        <view class="title">找回账户和密码</view>
        <view class="content">
            <text>
                请联系管理员找回账户和密码\n
            </text>
        </view>
        <view class="footer">
            <button type="default" @click="onConfirm">联系管理员</button>
        </view>
    </view>
</template>

<script>
    export default {
        methods: {
            onConfirm() {
                uni.navigateBack(); // 返回上一页
            }
        }
    };
</script>

<style scoped>
    .container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        /* height: 100%; */
        justify-content: space-between;
        background-color: #fff;
    }

    .title {
        font-size: 22px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
    }

    .content {
        flex: 1;
        font-size: 16px;
        line-height: 1.8;
        color: #333;
        white-space: pre-wrap;
    }

    .footer {
        margin-top: 20px;
        text-align: center;
    }

    button {
        padding: 10px 20px;
        font-size: 16px;
    }
</style>