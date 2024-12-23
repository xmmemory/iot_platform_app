// 映射对象，包含了 var_type 和对应的文本
export const codeMapping = {
    REAL: 'VD',
    INT: 'VW',
    BOOL: 'M'
};

// 包含了 var_type 和对应的文本
export const varBoolMapping = {
    False: '关闭',
    True: '开启',
    null: '关闭'
};

// 包含了 var_type 和对应的文本
export const varStatusMapping = {
    1: '运行',
    2: '停止',
    3: '故障'
};

export const default_icon_addr = "/static/device/device_default.png";

export const getNote = (permission: string) => {
    if (permission === 'R/W' || permission === 'W') {
        return '读写'
    } else if (permission === 'R') {
        return '只读';
    } else {
        return '未知权限'; // 如果没有权限或者其他值
    }
};