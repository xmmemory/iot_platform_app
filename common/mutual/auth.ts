import { request_auth } from "./request_api.ts"
import { ref } from 'vue';

export var login_status = ref<boolean>(false);
export var user_permission = ref<string>("user");

export function func_login(auth_userName : { value : string; }, auth_password : { value : string; }, local_version: string, callback) {
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
        local_version: local_version,
    }
    // console.log(data)
    request_auth(data, callback);
}