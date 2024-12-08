import { request_auth } from "@/common/mutual/request_post.ts"
import { ref } from 'vue';

export var login_status = ref<boolean>(false);

function auth_confirm(res : { statusCode : string | number; data : any; }) {
    if (200 == res.statusCode) {
        uni.hideToast();        
        uni.setStorageSync('cookie', res.data);
        login_status.value = true;
        console.log("login succeed.")
    } else {
        uni.showToast({
            title: '错误代码：' + res.statusCode,
            icon: 'error',
            mask: true,
            duration: 1000
        });
        console.log(res);
    }
}

export function func_login(auth_userName : { value : string; }, auth_password : { value : string; }) {
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