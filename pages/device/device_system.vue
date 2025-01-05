<template>
    <device_title :deviceName="deviceName" :deviceArea="deviceArea" />
    <view style="padding: 20px;">
        <template v-for="(item, index) in device_vars" :key="item.var_id">
            <!-- Device Info Row -->
            <view class="uni-flex uni-row" style="margin-top: 15rpx; margin-bottom: 15rpx;">
                <view class="device-var-name">
                    {{ item.var_name }}
                </view>
                <view class="text" style="-webkit-flex: 1;flex: 1;"> </view>
                <button @click="goToDevicePage(item.var_name, item.var_type, item.var_full_code)" type="primary"
                    size="mini" style="width: 320rpx; font-size: 17px;">历史记录查询</button>
            </view>
            <!-- Current Value Display -->
            <uni-list-chat :avatar-circle="true" :title="formatTitle(item)" :avatar="default_icon_addr"
                :time="item.last_datetime"
                :note="item.var_permission === 'R/W' || item.var_permission === 'W' ? '可控制' : '只读'"
                :clickable="item.var_permission === 'R/W' || item.var_permission === 'W' ? true : false"
                @click="handleClick(item)">
            </uni-list-chat>
        </template>
    </view>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { onLoad, onUnload } from '@dcloudio/uni-app';
    import { request_post, request_get } from "@/common/mutual/request_api.ts"
    import { varBoolMapping, default_icon_addr } from '@/common/mapping.ts'
    import { deviceName, deviceArea } from "@/components/device/device.ts"
    import device_title from "@/components/device/device_title.vue";

    const device_id = ref<string | null>(null);
    let device_vars = ref(null);
    let time_run = true;
    const time = ref()

    function bindTimeChange(e : any) {
        time.value = e.detail.value
    }

    function handleClick(item : { var_type : string; var_full_code : any; latest_value : string | number; }) {
        if (item.var_type === 'BOOL') {
            // 如果 var_type 是 'BOOL'，调用 changeStatus
            changeStatus(item.var_full_code, varBoolMapping[item.latest_value]);
        } else {
            // 否则，调用 inputValue
            inputValue(item.var_full_code);
        }
    }

    function formatTitle(item : { var_name : string; var_type : string; latest_value : string; }) {
        // 确保 item.latest_value 存在并且是布尔值 'True' 或 'False'
        if (item.var_type === 'BOOL' && (item.latest_value === 'True' || item.latest_value === 'False')) {
            return '当前状态：' + varBoolMapping[item.latest_value] || '未知状态';
        } else if (item.var_name === '系统运行状态') {
            return item.latest_value;
        }
        // special var.
        if (item.var_name.includes('频率')) {
            return '当前数值：' + formatValue(item.latest_value) + 'Hz';
        } else if (item.var_name.includes('电流')) {
            return '当前数值：' + formatValue(item.latest_value) + 'A';
        } else if (item.var_name.includes('电压')) {
            return '当前数值：' + formatValue(item.latest_value) + 'V';
        } else if (item.var_name.includes('功率')) {
            return '当前数值：' + formatValue(item.latest_value) + 'KW';
        } else if (item.var_name.includes('时间设定')) {
            return '当前数值：' + formatValue(item.latest_value) + '分钟';
        } else if (item.var_name.includes('电能')) {
            return '当前数值：' + formatValue(item.latest_value) + 'kw/h';
        }

        // 否则，返回 '当前数值：' + 格式化数值
        return '当前数值：' + formatValue(item.latest_value);
    }

    // 格式化数值函数
    function formatValue(value : any) {
        return parseFloat(value) % 1 === 0 ? parseInt(value) : parseFloat(value).toFixed(1);
    }

    function changeStatus(var_full_code : any, var_status : string) {
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
                    request_post("control/var", { command: "flip_switch", var_full_code: var_full_code, new_var_value: new_var_value }, handleMessage_control_res);
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

    function handleMessage_control_res(res : { data : any; }) {
        ;
    }

    function inputValue(var_full_code : any) {
        uni.showModal({
            title: '数据修改',
            editable: true,
            placeholderText: '请输入',
            success: function (res) {
                if (res.confirm) {
                    console.log(res.content);
                    request_post("control/var", { command: "modify_value", var_full_code: var_full_code, new_var_value: res.content }, handleMessage_control_res);
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

    // 获取页面参数并设置标题
    onLoad((options) => {
        if (options.id) {
            device_id.value = options.id || null;
            deviceName.value = options.name || null;
            deviceArea.value = options.area || null;
            request_get(`vars/device/f?device_id=${device_id.value}`, handleMessage_vars);
            restartMonitorChange(INTERVAL);
        }
        time_run = true;
    });

    onUnload(() => {
        // console.log("onUnload")
        time_run = false;
        if (monitorRecordChange) {
            clearInterval(monitorRecordChange);
            monitorRecordChange = null;
        }
    });

    function handleMessage_vars(res : { data : any; }) {
        device_vars.value = res.data;
        // 将 "T" 替换为 " ":
        device_vars.value = device_vars.value.map((item : any) => ({
            ...item,
            last_datetime: item.last_datetime.replace('T', ' '),
        }));
        // 查找“启动中”，“停止中”和“系统运行中”
        const startUp = device_vars.value.find((item) => item.var_name === "启动中");
        const stopUp = device_vars.value.find((item) => item.var_name === "停止中");
        const systemRunning = device_vars.value.find((item) => item.var_name === "系统运行中");

        let systemStatusValue = "系统停止";  // 默认值

        if (startUp && startUp.latest_value === "True") {
            systemStatusValue = "启动中";
        } else if (stopUp && stopUp.latest_value === "True") {
            systemStatusValue = "停止中";
        } else if (systemRunning && systemRunning.latest_value === "True") {
            systemStatusValue = "系统运行中";
        }



        // 添加“系统运行状态”
        device_vars.value.unshift({
            var_id: 0,
            var_name: "系统运行状态",
            var_code: "9999",  // 根据实际需求设置
            var_type: "REAL",
            var_permission: "R",
            latest_value: systemStatusValue,
            last_datetime: device_vars.value.filter(
                item => item.var_name === "系统运行中")[0]?.last_datetime,
            var_full_code: device_vars.value.filter(
                item => item.var_name === "系统运行中")[0]?.var_full_code,
        });
        // console.log(device_vars.value)

        // 先删除“启动中”，“停止中”，“系统运行中”
        device_vars.value = device_vars.value.filter(item => !["启动中", "停止中", "系统运行中"].includes(item.var_name));


        // console.log('Received WebSocket message:', res);
    }

    const INTERVAL = 1000; // 定时器间隔
    let monitorRecordChange = ref();

    function startMonitorChange(interval_ms : number) {
        monitorRecordChange = setInterval(() => {
            if (time_run) {
                request_get(`vars/device/f?device_id=${device_id.value}`, handleMessage_vars);
            }
        }, interval_ms);
    }

    // 当需要重新启动定时器时，调用 start Monitor Change 函数
    // 例如：在某个事件或条件满足时
    function restartMonitorChange(interval_ms : number) {
        if (monitorRecordChange) {
            clearInterval(monitorRecordChange);
            monitorRecordChange = null;
        }
        if (null == monitorRecordChange) {
            startMonitorChange(interval_ms);
        }
    }

    function goToDevicePage(name : any, type : any, var_full_code : any) {
        const url = `/pages/device/device_record?var_full_code=${var_full_code}&name=${name}&type=${type}&deviceName=${deviceName.value}&deviceArea=${deviceArea.value}`;
        time_run = false;
        uni.navigateTo({
            url: url,
        });
    };
</script>

<style scoped>
    .device-var-name {
        text-align: left;
        font-size: 22px;
        font-weight: bold;
        margin-top: 20rpx;
        margin-bottom: 10rpx;
        width: 300rpx;
    }
</style>