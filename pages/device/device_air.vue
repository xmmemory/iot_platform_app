<template>
    <!-- <view class="container"> -->
    <device_title :deviceName="deviceName" :deviceArea="deviceArea" />
    <view style="padding: 20px;">
        <template v-for=" (item, index) in device_vars" :key="item.var_id">
            <template v-if="item.var_permission === 'R'">
                <view class="uni-flex uni-row" style="margin-top: 15rpx; margin-bottom: 15rpx;">
                    <view class="text"
                        style="text-align: left; font-size: 22px; font-weight: bold; margin-top: 20rpx; margin-bottom: 10rpx; width: 300rpx;">
                        {{ item.var_name }}
                    </view>
                    <view class="text" style="-webkit-flex: 1;flex: 1;"> </view>
                    <button @click="goToDevicePage(item.var_name,item.var_type, item.var_full_code)" type="primary"
                        size="mini" style="width: 320rpx; font-size: 17px;">历史记录查询</button>
                </view>
                <template v-if="item.var_type === 'BOOL'">
                    <uni-list-chat :avatar-circle="true" :key="item.var_id"
                        :title="'当前状态：' + varBoolMapping[item.latest_value]" avatar="/static/device/device_default.png"
                        note="只读" :time="item.last_datetime" :clickable="false"></uni-list-chat>
                </template>
                <template v-else>
                    <template v-if="item.var_name === '运行状态'">
                        <uni-list-chat :avatar-circle="true" :key="item.var_id"
                            :title="'当前状态：' + varStatusMapping[item.latest_value]"
                            avatar="/static/device/device_default.png" note="只读" :time="item.last_datetime"
                            :clickable="true"></uni-list-chat>
                    </template>
                    <template v-else>
                        <template v-if="item.var_name === '运行状态'">
                            <text class="var-value">{{ varStatusMapping[item.var_name] || '未知状态' }}</text>
                        </template>
                        <template v-else-if="item.var_name.includes('电压')">
                            <uni-list-chat :avatar-circle="true" :key="item.var_id" :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ? 
                                parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(1))+'V'"
                                avatar="/static/device/device_default.png" note="只读" :time="item.last_datetime"
                                :clickable="true"></uni-list-chat>
                        </template>
                        <template v-else-if="item.var_name.includes('电流')">
                            <uni-list-chat :avatar-circle="true" :key="item.var_id" :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ?
                                parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(1))+'A'"
                                avatar="/static/device/device_default.png" note="只读" :time="item.last_datetime"
                                :clickable="true"></uni-list-chat>
                        </template>
                        <template v-else-if="item.var_name.includes('实际') ">
                            <uni-list-chat :avatar-circle="true" :key="item.var_id" :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ?
                                parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(1))+'mg/m3'"
                                avatar="/static/device/device_default.png" note="只读" :time="item.last_datetime"
                                :clickable="true"></uni-list-chat>
                        </template>
                        <template v-else>
                            <uni-list-chat :avatar-circle="true" :key="item.var_id" :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ?
                                    parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(1))"
                                avatar="/static/device/device_default.png" note="只读" :time="item.last_datetime"
                                :clickable="true"></uni-list-chat>
                        </template>

                    </template>
                </template>
            </template>

            <template v-else-if="item.var_permission === 'R/W'">
                <view class="uni-flex uni-row" style="margin-top: 15rpx; margin-bottom: 15rpx;">
                    <view class="text"
                        style="text-align: left; font-size: 22px; font-weight: bold; margin-top: 20rpx; margin-bottom: 10rpx; width: 300rpx;">
                        {{ item.var_name }}
                    </view>
                    <view class="text" style="-webkit-flex: 1;flex: 1;"> </view>
                    <button @click="goToDevicePage(item.var_name,item.var_type, item.var_full_code)" type="primary"
                        size="mini" style="width: 320rpx; font-size: 17px;">历史记录查询</button>
                </view>
                <template v-if="item.var_type === 'BOOL'">
                    <uni-list-chat :avatar-circle="true" :key="item.var_id"
                        :title="'当前状态：' + varBoolMapping[item.latest_value]" avatar="/static/device/device_default.png"
                        note="可控" :time="item.last_datetime" :clickable="true"
                        @click="changeStatus(item.var_full_code, varBoolMapping[item.latest_value])"></uni-list-chat>
                </template>
                <template v-else>
                    <template v-if="item.var_name.includes('量程')">
                        <uni-list-chat :avatar-circle="true" :key="item.var_id" :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ?
                            parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(1))+'mg/m3'"
                            avatar="/static/device/device_default.png" note="只读" :time="item.last_datetime"
                            :clickable="true"></uni-list-chat>
                    </template>
                    <template v-else-if="item.var_name.includes('频率') ">
                        <uni-list-chat :avatar-circle="true" :key="item.var_id" :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ?
                            parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(1))+'Hz'"
                            avatar="/static/device/device_default.png" note="可控" :time="item.last_datetime"
                            @click="inputValue(item.var_full_code)" :clickable="true"></uni-list-chat>
                    </template>
                    <template v-else-if="item.var_name.includes('补偿') ">
                        <uni-list-chat :avatar-circle="true" :key="item.var_id" :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ?
                            parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(1))+'mg/m3'"
                            avatar="/static/device/device_default.png" note="可控" :time="item.last_datetime"
                            :clickable="true"></uni-list-chat>
                    </template>
                    <template v-else>
                        <uni-list-chat :avatar-circle="true" :key="item.var_id"
                            :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ? parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(1))"
                            avatar="/static/device/device_default.png" note="可控" :time="item.last_datetime"
                            :clickable="true" @click="inputValue(item.var_full_code)"></uni-list-chat>
                    </template>
                </template>
            </template>

            <template v-else-if="item.var_permission === 'W'">
                <view class="uni-flex uni-row" style="margin-top: 15rpx; margin-bottom: 15rpx;">
                    <view class="text"
                        style="text-align: left; font-size: 22px; font-weight: bold; margin-top: 20rpx; margin-bottom: 10rpx; width: 300rpx;">
                        {{ item.var_name }}
                    </view>
                    <view class="text" style="-webkit-flex: 1;flex: 1;"> </view>
                    <button @click="goToDevicePage(item.var_name,item.var_type, item.var_full_code)" type="primary"
                        size="mini" style="width: 300rpx; font-size: 17px;">历史记录查询</button>
                </view>
                <template v-if="item.var_type === 'BOOL'">
                    <uni-list-chat :avatar-circle="true" :key="item.var_id" title=""
                        avatar="/static/device/device_default.png" :note="codeMapping[item.var_type] + item.var_code"
                        :time="item.last_datetime" :clickable="true" @click="changeStatus"></uni-list-chat>
                </template>
                <template v-else>
                    <uni-list-chat :avatar-circle="true" :key="item.var_id" title=""
                        avatar="/static/device/device_default.png" :note="codeMapping[item.var_type] + item.var_code"
                        :time="item.last_datetime" :clickable="true"
                        @click="inputValue(item.var_full_code)"></uni-list-chat>
                </template>
            </template>
        </template>
    </view>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { onLoad, onUnload } from '@dcloudio/uni-app';
    import { request_post, request_get } from "@/common/mutual/request_api.ts"
    import { codeMapping, varBoolMapping, varStatusMapping } from '@/common/mapping.ts'
    import { deviceName, deviceArea } from "@/components/device/device.ts"
    import device_title from "@/components/device/device_title.vue";

    const device_id = ref<string | null>(null);
    let device_vars = ref(null);
    let time_run = true;

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
        // console.log('Received WebSocket message:', res);
    }

    let INTERVAL = 800; // 定时器间隔
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
    .container {
        padding: 20px;
    }
</style>