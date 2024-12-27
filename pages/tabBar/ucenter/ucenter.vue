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
            <button v-if="auth_userName.includes('leon')" size="default" type="warn" class="navigator-button"
                @click="clearTotalData">清空缓存数据</button>
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
                <button size="default" type="primary" style="margin-top: 20rpx; margin-bottom: 10rpx;"
                    @click="checkUpdate">检查更新</button>
            </view>

            <!-- 链接导航 -->
            <view class="links uni-center">
                <navigator url="/pages/notice/forgot_password">忘记密码</navigator>
            </view>
        </view>
    </template>
    <template v-if="progress > 0">
        <p>下载进度: {{ progress }}%</p>
        <view class="progress-bar">
            <view class="progress" :style="{ width: progress + '%' }"></view>
        </view>
    </template>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { onLoad } from '@dcloudio/uni-app'
    import { request_post_simu_ws } from "@/common/mutual/request_api.ts"
    import { login_status, func_login } from "@/common/mutual/auth.ts"

    const system_info = uni.getSystemInfoSync();
    // console.log(system_info)
    // 用户输入的数据
    const auth_userName = ref<string>(uni.getStorageSync('auth_userName'));
    const auth_password = ref<string>(uni.getStorageSync('auth_password'));
    let progress = ref(0)
    var updating = false;

    onLoad(() => {
        if (false == login_status.value && auth_userName.value && auth_password.value) {
            login();
        }
    })

    // 登录逻辑
    function login() {
        if (!auth_userName.value || !auth_password.value) {
            uni.showToast({
                title: '请输入用户名和密码',
                icon: 'none',
            });
            return;
        }
        // 获取当前时间
        let currentDate = new Date();
        // 指定日期，格式为 "YYYY-MM-DD"
        let targetDate = new Date("2025-1-1");
        // 判断当前时间是否超过目标日期
        if (currentDate > targetDate) {
            uni.showToast({
                title: "请更新最新版本!",
                icon: "error",
                mask: true,
                duration: 3000
            });
        }
        else {
            func_login(auth_userName, auth_password);
        }
    };

    function call_us() {
        uni.makePhoneCall({
            phoneNumber: "0531-59534953",
            success: () => {
                console.log("成功拨打电话")
            }
        })
    }

    function handleMessage_res(res : { data : any; }) {
        console.log('Received WebSocket message:', res.data);
        // uni.showToast({
        //     title: res.data,
        //     icon: "none",
        //     mask: true,
        //     duration: 1000
        // });
    }

    function handleMessage_projects_checkUpdate(res : { data : { latest_version : any[][]; }; }) {
        const current_version = plus.runtime.version;
        const latest_version = res.data.latest_version[0][0];
        const release_notes = "优化了用户体验";
        console.log("有新版本更新", current_version, latest_version);
        if (compareVersions(latest_version, current_version) > 0) {// 提示用户更新
            uni.showModal({
                title: '有新版本啦！',
                content: `最新版本：${latest_version}\n更新内容：${release_notes}`,
                confirmText: '去更新',
                cancelText: '暂不更新',
                success: (res) => {
                    if (res.confirm) {
                        // 下载并安装更新
                        const download_url = "http://49.232.133.59:7500/download/" + latest_version + ".apk"
                        console.log(download_url);
                        downloadAndInstallUpdate(download_url);
                    }
                }
            });
        }
        else {
            uni.showToast({
                title: "已是最新版本",
                icon: "none",
                mask: true,
                duration: 1000
            });
            updating = false;
        }
    }

    function compareVersions(version1, version2) {
        const v1Parts = version1.split('.').map(Number);  // 将版本号按 "." 分割并转换为数字数组
        const v2Parts = version2.split('.').map(Number);  // 同上

        // 比较每一部分
        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1 = v1Parts[i] || 0;  // 如果某一部分不存在，则视为 0
            const v2 = v2Parts[i] || 0;

            if (v1 > v2) return 1;  // version1 较大
            if (v1 < v2) return -1; // version2 较大
        }

        return 0;  // 版本相同
    }

    function checkUpdate() {
        if (updating) {
            uni.showToast({
                title: "正在更新请稍等",
                icon: "none",
                mask: true,
                duration: 1000
            });
        }
        updating = true;
        request_post_simu_ws("getVersion", { username: auth_userName.value }, handleMessage_projects_checkUpdate);
    }

    function downloadAndInstallUpdate(downloadUrl : string) {
        console.log("Starting download from:", downloadUrl);

        // 初始化进度
        const dtask = plus.downloader.createDownload(downloadUrl, {}, (download, status) => {
            if (status === 200) {
                console.log("Download successful, file path:", download.filename);

                // 安装 APK
                plus.runtime.install(download.filename, {}, () => {
                    console.log("Install successful, restarting...");
                    uni.showToast({ title: '更新成功，即将重启应用', icon: 'none' });
                    plus.runtime.restart();
                }, (e) => {
                    console.error("Install failed:", e.message);
                    uni.showToast({ title: '安装失败，请稍后再试', icon: 'none' });
                });
            } else {
                console.error("Download failed with status:", status);
                uni.showToast({ title: '下载失败，请稍后再试', icon: 'none' });
            }
        });

        // 监听下载进度
        dtask.addEventListener("statechanged", (task, status) => {
            if (task.state === 3) { // 任务正在下载
                const downloadedSize = task.downloadedSize; // 已下载字节数
                const totalSize = task.totalSize; // 总字节数

                if (totalSize > 0) {
                    const progress = Math.floor((downloadedSize / totalSize) * 100);
                    console.log(`Download progress: ${progress}%`);
                    // 更新进度条
                    updateProgress(progress); // 定义更新进度的函数
                }
            }
        });

        dtask.start();
        console.log("Download task started:", dtask);
    }

    function updateProgress(e : number) {
        progress.value = e;
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
            duration: 2000,

        })
    }
</script>

<style lang="scss" scoped>
    // background-color: #dbf8f8;
    /* 整个页面的容器 */
    .auth_logo {
        height: 100px;
        width: 100px;
        margin: 250rpx 18% 120rpx 18%;
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
        margin-bottom: 15px;
        /* 为每个按钮添加底部外边距 */
    }

    .progress-bar {
        width: 100%;
        height: 10px;
        background-color: #f0f0f0;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 10px;
    }

    .progress {
        height: 100%;
        background-color: #4caf50;
        transition: width 0.3s ease;
    }
</style>