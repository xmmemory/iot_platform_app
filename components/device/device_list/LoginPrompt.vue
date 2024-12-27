<template name="LoginPrompt">
    <view class="login-container">
        <image class="company-logo" src="/static/company_logo/s-logo.png" mode="heightFix"></image>
        <navigator url="/pages/tabBar/ucenter/ucenter" open-type="switchTab" hover-class="other-navigator-hover">
            <button class="login-button" type="default">登录，体验完整功能</button>
        </navigator>
    </view>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;

        .company-logo {
            height: 100px;
            width: 100px;
            margin: 300rpx 18% 120rpx 18%;
        }

        .login-button {
            background-color: #00c853;
            /* 绿色背景 */
            color: white;
            /* 白色文字 */
            padding: 10px 20px;
            /* 内边距 */
            border-radius: 5px;
            /* 圆角 */
            font-size: 20px;
            /* 字体大小 */
            border: none;
            /* 无边框 */
            cursor: pointer;
            /* 鼠标悬停时显示指针 */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            /* 阴影 */
            transition: background-color 0.3s, transform 0.3s;
            /* 过渡效果 */
        }

        .login-button:hover {
            background-color: #00b359;
            /* 悬停时的背景颜色 */
            transform: translateY(-2px);
            /* 悬停时的上移效果 */
        }
    }
</style>