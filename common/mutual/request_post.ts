import { server_url } from "./server_parameter.ts"

export function request_auth(data : { username : string; password : string; }, callback: { (res: { statusCode: string | number; data: any; }): void; (arg0: any): void; }) {
    let header = {
        'Content-Type': 'application/json',
    };
    request_post(server_url + 'login', header, data, callback);
}

export function request_post_simu_ws(post_url : string, data : any, callback ?: (arg0: any) => void) {
    let header = {
        'Content-Type': 'application/json',
    };

    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.uniPlatform === 'mp-weixin') {
        header['cookie'] = uni.getStorageSync('cookie').toString() || 'null';
    } else {
        ;
    }
    request_post(server_url + post_url, header, data, callback);
}

function request_post(url : string, header : { "Content-Type" : string; }, data : any, callback ?: (arg0 : any) => void) {
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