import { login_post_url, data_post_url } from "./server_parameter.ts"

export function request_auth(data : { username : string; password : string; }, callback) {
    let header = {
        'Content-Type': 'application/json',
    };
    request_post(login_post_url, header, data, callback);
}

export function request_post_simu_ws(data : any, callback : (arg0 : UniApp.RequestSuccessCallbackResult) => void) {
    let header = {
        'Content-Type': 'application/json',
    };

    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.uniPlatform === 'mp-weixin') {
        header['cookie'] = uni.getStorageSync('cookie').toString() || 'null';
    } else {
        ;
    }
    request_post(data_post_url, header, data, callback);
}

function request_post(url : string, header : { "Content-Type" : string; }, data : any, callback : (arg0 : UniApp.RequestSuccessCallbackResult) => void) {
    uni.request({
        url: url,
        method: 'POST',
        timeout: 5000,
        header: header,
        withCredentials: true, // 添加这一行来允许跨域携带 Cookie                
        enableCookie: true,
        data: data,
        success: (res) => {
            callback(res);
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