import { request_auth } from "@/common/mutual/request_api.ts"
import { ref } from 'vue';

export var login_status = ref<boolean>(false);

function auth_confirm(res : { statusCode : string | number; data : any; }) {
    if (200 == res.statusCode) {
        uni.showToast({
            title: '登录成功',
            icon: 'success',
            mask: true,
            duration: 500
        });
        uni.setStorageSync('cookie', res.data);
        login_status.value = true;
        console.log("login succeed, cookie:",  res.data)
    } else {
        uni.showToast({
            title: res.data,
            icon: 'error',
            mask: true,
            duration: 1000
        });
        uni.removeStorageSync('auth_password');
        console.log(res);
    }
}

export function func_login(auth_userName : { value : string; }, auth_password : { value : string; }) {
    // console.log("login...")
    uni.showToast({
        title: '用户名密码验证',
        icon: 'loading',
        mask: true,
        duration: 5000
    });
    uni.setStorageSync('auth_userName', auth_userName.value);
    uni.setStorageSync('auth_password', auth_password.value);
    const data = {
        username: auth_userName.value.endsWith('-admin') || auth_userName.value.endsWith('-test')
            ? auth_userName.value.replace(/(-admin|-test)$/, '')
            : auth_userName.value,
        password: auth_password.value,
    }
    request_auth(data, auth_confirm);
}