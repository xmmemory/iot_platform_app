<template>
    <template v-if="login_status">
        <view class="uni-container">
            <view>
                <image class="auth_logo" src="/static/company_logo/s-logo.png" style="margin-bottom: 10px;"
                    mode="heightFix"></image>
                <view class="userinfo">
                    <view style="margin-bottom: 5px;"> {{auth_userName}} </view>
                    <view style="margin-bottom: 5px;"> APP版本: {{system_info.appVersion}} </view>
                </view>
            </view>
            <view v-if="auth_userName.includes('leon')" class="jump_url">
                <view class="navi-container">
                    <navigator url="/pages/manage/manage_devices" open-type="navigate"
                        hover-class="other-navigator-hover" class="navigator-button">
                        <button class="login-button" type="default">设备管理</button>
                    </navigator>
                    <navigator url="/pages/manage/manage_areas" open-type="navigate" hover-class="other-navigator-hover"
                        class="navigator-button">
                        <button class="login-button" type="default">区域管理</button>
                    </navigator>
                </view>
            </view>


            <button size="default" type="primary" class="navigator-button" @click="call_us">联系我们</button>

            <button size="default" type="primary" class="navigator-button" @click="checkUpdate">检查更新</button>
            <button size="default" type="primary" class="navigator-button" @click="signOut">退出登录</button>
            <button v-if="auth_userName.includes('admin')" type="warn" @click="clearTotalData">清空缓存数据</button>
            <view v-if="auth_userName.includes('admin')">{{system_info}}</view>
        </view>
    </template>
    <template v-else>
        <view class="uni-container">
            <!-- Logo -->
            <image class="auth_logo" src="@/static/company_logo/s-logo.png" mode="heightFix"></image>
            <view class="auth_input">
                <view class="title">用户名</view>
                <input class="user" type="text" v-model="auth_userName" placeholder="手机号码/用户ID" maxlength="15" />
                <view class="title">密码</view>
                <input class="password" v-model="auth_password" type="password" placeholder="密码" password=""
                    maxlength="15" confirm-type="done" @confirm="login" />
            </view>

            <!-- 协议勾选框 -->
            <view class="uni-flex uni-row uni-center" style="justify-content: center; align-items: center;">
                <view class="text">登录即表示同意绿如蓝账号</view>
                <navigator url="/pages/notice/term_server" class="agreement-link">用户服务协议</navigator>
                <view class="text" style="width: 30rpx;">和</view>
                <navigator url="/pages/notice/privacy_policy" class="agreement-link">隐私政策</navigator>
            </view>

            <view class="auth_input">
                <button size="default" type="primary" @click="login"
                    :disabled="!(auth_password.length >= 3) && !(auth_userName.length >= 3)">登录</button>
            </view>

            <!-- 链接导航 -->
            <view class="links uni-center">
                <navigator url="/pages/notice/forgot_password">忘记密码</navigator>
            </view>
        </view>
    </template>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { login_status, func_login } from "@/common/mutual/auth.ts"
    import { onLoad } from '@dcloudio/uni-app'

    const system_info = uni.getSystemInfoSync();
    // console.log(system_info)
    // 用户输入的数据
    const auth_userName = ref<string>(uni.getStorageSync('auth_userName'));
    const auth_password = ref<string>(uni.getStorageSync('auth_password'));

    onLoad(() => {
        if (false == login_status.value && auth_userName.value && auth_password.value) {
            func_login(auth_userName, auth_password);
        }
    })

    // 登录逻辑
    const login = () => {
        if (!auth_userName.value || !auth_password.value) {
            uni.showToast({
                title: '请输入用户名和密码',
                icon: 'none',
            });
            return;
        }
        // login.
        func_login(auth_userName, auth_password);
    };

    function call_us() {
        uni.makePhoneCall({
            phoneNumber: "0531-59534953",
            success: () => {
                console.log("成功拨打电话")
            }
        })
    }

    function checkUpdate() {
        uni.showToast({
            title: '您使用的已是最新版本',
            icon: "none",
            mask: true,
            duration: 1000
        });
    }

    function signOut() {
        login_status.value = false;
    }

    function clearTotalData() {
        uni.clearStorage();
        uni.showToast({
            title: '缓存数据已清空',
            icon: 'success',
            mask: true,
            duration: 2000
        })
    }
</script>

<style lang="scss" scoped>
    // background-color: #dbf8f8;
    /* 整个页面的容器 */
    .auth_logo {
        height: 100px;
        width: 100px;
        margin: 300rpx 18% 120rpx 18%;
    }

    .auth_input {
        font-size: 30rpx;
        margin: 20px 10% 20rpx 10%;

        .title {
            font-size: 40rpx;
            margin: 20px 0 20rpx 0;
        }

        .user {
            height: 80rpx;
            border: 1px solid #ccc;
        }

        .password {
            height: 80rpx;
            border: 1px solid #ccc;
        }

        .text {
            margin-bottom: 5rpx;
            /* 控制行间距 */
        }
    }

    .agreement-link {
        color: #007AFF;
        // margin-left: 5rpx;
        /* 给链接添加间距 */
    }

    //
    .userinfo {
        width: 100%;
        height: 200rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .user-image {
        border-radius: 50%;
        height: 200rpx;
        width: 200rpx;
        object-fit: cover;
    }

    .navi-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10rpx;
    }

    .navigator-button {
        width: 90%;
        /* 根据需要调整宽度 */
        margin-bottom: 20px;
        /* 为每个按钮添加底部外边距 */
    }
</style>