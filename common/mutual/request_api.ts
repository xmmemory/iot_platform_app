import { server_url } from "./server_parameter.ts"

export function request_get(get_url : string, callback ?: (arg0 : any) => void) {
    let header = {
        'Content-Type': 'application/json',
    };

    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.uniPlatform === 'mp-weixin') {
        header['cookie'] = uni.getStorageSync('cookie').toString() || 'null';
    } else {
        ;
    }
    request_get_api(server_url + get_url, header, callback);
}

function request_get_api(url : string, header : { "Content-Type" : string; }, callback ?: (arg0 : any) => void) {
    uni.request({
        url: url,
        method: 'GET',
        timeout: 3000,
        header: header,
        withCredentials: true, // 跨域请求时携带凭证（cookies）
        enableCookie: true,
        success: (res) => {
            // 如果 callback 存在，则调用它
            if (callback) {
                callback(res);
            }
        },
        fail: (res) => {
            console.log(res);
            uni.showToast({
                title: res.errMsg,
                icon: 'none',
                mask: true,
                duration: 2000
            })
        },
    });
}

export function request_post(post_url : string, data : any, callback ?: (arg0 : any) => void) {
    let header = {
        'Content-Type': 'application/json',
    };

    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.uniPlatform === 'mp-weixin') {
        header['cookie'] = uni.getStorageSync('cookie').toString() || 'null';
    } else {
        ;
    }
    request_post_api(server_url + post_url, header, data, callback);
}

function request_post_api(url : string, header : { "Content-Type" : string; }, data : any, callback ?: (arg0 : any) => void) {
    uni.request({
        url: url,
        method: 'POST',
        timeout: 5000,
        header: header,
        withCredentials: true, // 跨域请求时携带凭证（cookies）
        enableCookie: true,
        data: data,
        success: (res) => {
            // 如果 callback 存在，则调用它
            if (callback) {
                callback(res);
            }
        },
        fail: (res) => {
            console.log(res);
            uni.showToast({
                title: res.errMsg,
                icon: 'none',
                mask: true,
                duration: 2000
            })
        },
    });
}

export function request_put(post_url : string, data : any, callback ?: (arg0 : any) => void) {
    let header = {
        'Content-Type': 'application/json',
    };

    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.uniPlatform === 'mp-weixin') {
        header['cookie'] = uni.getStorageSync('cookie').toString() || 'null';
    } else {
        ;
    }
    request_put_api(server_url + post_url, header, data, callback);
}

function request_put_api(url : string, header : { "Content-Type" : string; }, data : any, callback ?: (arg0 : any) => void) {
    uni.request({
        url: url,
        method: 'PUT',
        timeout: 5000,
        header: header,
        withCredentials: true, // 跨域请求时携带凭证（cookies）
        enableCookie: true,
        data: data,
        success: (res) => {
            // 如果 callback 存在，则调用它
            if (callback) {
                callback(res);
            }
        },
        fail: (res) => {
            console.log(res);
            uni.showToast({
                title: res.errMsg,
                icon: 'none',
                mask: true,
                duration: 2000
            })
        },
    });
}

export function request_del(post_url : string, data : any, callback ?: (arg0 : any) => void) {
    let header = {
        'Content-Type': 'application/json',
    };

    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.uniPlatform === 'mp-weixin') {
        header['cookie'] = uni.getStorageSync('cookie').toString() || 'null';
    } else {
        ;
    }
    request_del_api(server_url + post_url, header, data, callback);
}

function request_del_api(url : string, header : { "Content-Type" : string; }, data : any, callback ?: (arg0 : any) => void) {
    uni.request({
        url: url,
        method: 'DELETE',
        timeout: 5000,
        header: header,
        withCredentials: true, // 跨域请求时携带凭证（cookies）
        enableCookie: true,
        data: data,
        success: (res) => {
            // 如果 callback 存在，则调用它
            if (callback) {
                callback(res);
            }
        },
        fail: (res) => {
            console.log(res);
            uni.showToast({
                title: res.errMsg,
                icon: 'none',
                mask: true,
                duration: 2000
            })
        },
    });
}

export function request_auth(data : { username : string; password : string; }, callback : { (res : { statusCode : string | number; data : any; }) : void; (arg0 : any) : void; }) {
    let header = {
        'Content-Type': 'application/json',
    };
    request_post_api(server_url + 'login', header, data, callback);
}