<template>
    <view class="container">
        <page-head :title="deviceName"></page-head>
        <template v-for="(item, index) in device_vars" :key="item.var_id">

            <template v-if="item.var_permission === 'R'">
                <div
                    style="text-align: left; font-size: 22px; font-weight: bold; margin-top: 20rpx; margin-bottom: 10rpx;">
                    {{ item.var_name }}
                </div>
                <!-- <button type="primary" size="mini">read</button> -->
                <template v-if="item.var_type === 'BOOL'">
                    <uni-list-chat :avatar-circle="true" :key="item.var_id"
                        :title="'当前状态：' + varBoolMapping[item.latest_value]"
                        avatar="/static/device/device_default.png" note="只读" :time="item.last_datetime"
                        :clickable="false"></uni-list-chat>
                </template>
                <template v-else>
                    <uni-list-chat :avatar-circle="true" :key="item.var_id"
                        :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ? parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(3))"
                        avatar="/static/device/device_default.png" note="只读" :time="item.last_datetime"
                        :clickable="false"></uni-list-chat>
                </template>
            </template>

            <template v-else-if="item.var_permission === 'R/W'">
                <!-- <button type="primary" size="mini">read&write</button> -->
                <div
                    style="text-align: left; font-size: 22px; font-weight: bold; margin-top: 20rpx; margin-bottom: 10rpx;">
                    {{ item.var_name }}
                </div>
                <template v-if="item.var_type === 'BOOL'">
                    <uni-list-chat :avatar-circle="true" :key="item.var_id"
                        :title="'当前状态：' + varBoolMapping[item.latest_value]"
                        avatar="/static/device/device_default.png" note="可控" :time="item.last_datetime"
                        :clickable="true" @click="changeStatus(varBoolMapping[item.latest_value])"></uni-list-chat>
                </template>
                <template v-else>
                    <uni-list-chat :avatar-circle="true" :key="item.var_id"
                        :title="'当前数值：' + (parseFloat(item.latest_value) % 1 === 0 ? parseInt(item.latest_value) : parseFloat(item.latest_value).toFixed(3))"
                        avatar="/static/device/device_default.png" note="可控" :time="item.last_datetime"
                        :clickable="true" @click="inputValue"></uni-list-chat>
                </template>
            </template>

            <template v-else-if="item.var_permission === 'W'">
                <div
                    style="text-align: left; font-size: 22px; font-weight: bold; margin-top: 20rpx; margin-bottom: 10rpx;">
                    {{ item.var_name }}
                </div>
                <!-- <button type="primary" size="mini">write</button> -->
                <template v-if="item.var_type === 'BOOL'">
                    <uni-list-chat :avatar-circle="true" :key="item.var_id" title=""
                        avatar="/static/device/device_default.png"
                        :note="codeMapping[item.var_type] + item.var_code" :time="item.last_datetime" :clickable="true"
                        @click="changeStatus"></uni-list-chat>
                </template>
                <template v-else>
                    <uni-list-chat :avatar-circle="true" :key="item.var_id" title=""
                        avatar="/static/device/device_default.png"
                        :note="codeMapping[item.var_type] + item.var_code" :time="item.last_datetime" :clickable="true"
                        @click="inputValue"></uni-list-chat>
                </template>
            </template>

        </template>
    </view>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { onLoad, onUnload } from '@dcloudio/uni-app';
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"
    import { codeMapping, varBoolMapping } from '@/common/mapping.ts'

    const device_id = ref<string | null>(null);
    const deviceName = ref<string | null>(null);
    const deviceStatus = ref<string | null>(null);
    const deviceArea = ref<string | null>(null);
    let device_vars = ref(null);

    function changeStatus(e) {
        let content_key = "";
        if (e == "关闭") {
            content_key = "开启";
            console.log(content_key)
        }
        else {
            content_key = "关闭";
            console.log(content_key)
        }
        uni.showModal({
            title: '提示',
            content: "确认" + content_key + "设备？",
            success: (res) => {
                if (res.confirm) {
                    ;
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    }

    function inputValue(e) {
        uni.showModal({
            title: '数据修改',
            editable: true,
            placeholderText: '请输入',
            success: function (res) {
                if (res.confirm) {
                    console.log(res.content);
                    // request_post_simu_ws("modifyArea", { command: "update_area", area_id: area_id, area_name: res.content }, handleMessage_updateArea);
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
            deviceStatus.value = options.status || null;
            deviceArea.value = options.area || null;
            // 动态设置页面标题
            // uni.setNavigationBarTitle({
            //     title: deviceName.value,
            // });
        }
        request_post_simu_ws("getVar", { command: "filter_device_id", device_id: device_id.value }, handleMessage_vars);
        restartMonitorChange(INTERVAL);
    });

    onUnload(() => {
        console.log("onUnload")
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

        console.log('Received WebSocket message:', res);
        uni.hideToast();
    }

    let INTERVAL = 3000; // 定时器间隔
    let monitorRecordChange = ref();

    function startMonitorChange(interval_ms : number) {
        monitorRecordChange = setInterval(() => {
            request_post_simu_ws("getVar", { command: "filter_device_id", device_id: device_id.value }, handleMessage_vars);
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
</script>

<style scoped>
    .container {
        padding: 20px;
    }

    .device-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .device-details {
        font-size: 16px;
        color: #666;
    }

    .device-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        margin-top: 16px;

        .no-devices {
            grid-column: 1 / -1;
            /* 占据所有列 */
            text-align: center;
            font-size: 18px;
            color: #888;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 8px;
        }

        .device-card {
            background-color: #fff;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;

            .device-icon {
                width: 60px;
                height: 60px;
                object-fit: cover;
                margin-bottom: 10px;
            }

            .device-info {
                .device-title {
                    font-size: 16px;
                    font-weight: bold;
                }

                .device-details {
                    font-size: 16px;
                    color: #666;
                }
            }
        }
    }
</style>