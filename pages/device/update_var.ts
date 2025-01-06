import { varBoolMapping } from '../../common/mapping.ts'
import { request_post } from "../../common/mutual/request_api.ts"

// 格式化数值函数
export function formatValue(value: any) {
    return parseFloat(value) % 1 === 0 ? parseInt(value) : parseFloat(value).toFixed(1);
}

export function inputValue(var_full_code: any) {
    uni.showModal({
        title: '数据修改',
        editable: true,
        placeholderText: '请输入',
        success: function (res) {
            if (res.confirm) {
                console.log(res.content);
                request_post("update/var", { command: "update_value", var_full_code: var_full_code, new_var_value: res.content }, msg_cb_update_var);
                uni.showToast({
                    title: '指定发送中',
                    icon: 'loading',
                    mask: true,
                    duration: 2000
                })
            } else if (res.cancel) {
                console.log('用户点击取消');
            }
        }
    });
}

export function changeStatus(var_full_code: any, var_status: string) {
    // console.log(var_full_code, var_status)
    let new_var_value = 'False';
    if (var_status == "关闭") {
        new_var_value = 'True';
    }
    else {
        new_var_value = 'False';
    }
    uni.showModal({
        title: '提示',
        content: "确认" + varBoolMapping[new_var_value] + "设备？",
        success: (res) => {
            if (res.confirm) {
                request_post("update/var", { command: "flip_switch", var_full_code: var_full_code, new_var_value: new_var_value }, msg_cb_update_var);
                uni.showToast({
                    title: '指定发送中',
                    icon: 'loading',
                    mask: true,
                    duration: 2000
                })
            } else if (res.cancel) {
                console.log('用户点击取消');
            }
        }
    });
}

function msg_cb_update_var(res: { data: any; }) {
    ;
}