<template>
    <view>
        <template v-if="Array.isArray(var_record)">
            <!-- 标题 -->
            <view class="header">
                <text class="device-name">{{deviceName}} | </text>
                <text class="device-area">{{deviceArea}}</text>
            </view>

            <!-- 记录列表 -->
            <view class="layout">
                <view class="row" v-for="(item) in var_record" :key="item.created_at">
                    <view class="title">
                        <text class="var-name">{{var_name}}:</text>
                        <template v-if="var_name === '运行状态'">
                            <text class="var-value">{{ varStatusMapping[item.value] || '未知状态' }}</text>
                        </template>
                        <template v-else-if="var_name.includes('电压')">
                            <text class="var-value">{{item.value}}V</text>
                        </template>
                        <template v-else-if="var_name.includes('电流')">
                            <text class="var-value">{{item.value}}A</text>
                        </template>
                        <template v-else-if="var_name.includes('时间')">
                            <text class="var-value">{{item.value}}分钟</text>
                        </template>
                        <template v-else-if="var_name.includes('甲烷')">
                            <text class="var-value">{{item.value}}mg/m3</text>
                        </template>
                        <template v-else-if="var_name.includes('氨气')">
                            <text class="var-value">{{item.value}}mg/m3</text>
                        </template>
                        <template v-else>
                            <text class="var-value">
                                <template v-if="item.value === 'True'">开启</template>
                                <template v-else-if="item.value === 'False'">关闭</template>
                                <template v-else>
                                    {{item.value}}
                                </template>
                            </text>
                        </template>
                    </view>
                    <view class="content">
                        <text class="record-time">记录时间：{{item.created_at}}</text>
                    </view>
                </view>
            </view>
        </template>
    </view>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { onLoad, onUnload } from '@dcloudio/uni-app';
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"
    import { varStatusMapping } from '@/common/mapping.ts'

    const deviceName = ref<string | null>(null);
    const deviceArea = ref<string | null>(null);
    const var_full_code = ref<string | null>(null);
    const var_name = ref<string | null>(null);
    const var_type = ref<string | null>(null);
    let var_record = ref(null);

    // 获取页面参数并设置标题
    onLoad((options) => {
        // console.log(options)
        if (options.var_full_code) {
            var_full_code.value = options.var_full_code || null;
            var_name.value = options.name || null;
            var_type.value = options.type || null;
            deviceName.value = options.deviceName || null;
            deviceArea.value = options.deviceArea || null;
            request_post_simu_ws("getVarValue", { command: "1", var_full_code: var_full_code.value }, handleMessage_recordValue);
            // restartMonitorChange(INTERVAL);
        }
    });

    onUnload(() => {
        // console.log("onUnload")
        if (monitorRecordChange) {
            clearInterval(monitorRecordChange);
            monitorRecordChange = null;
        }
    });

    function handleMessage_recordValue(res : { data : any; }) {
        var_record.value = res.data;
        console.log('Received WebSocket message:', var_record);
        // 将 "T" 替换为 " ":
        var_record.value = var_record.value.map((item : any) => ({
            ...item,
            created_at: item.created_at.replace('T', ' '),
        }));
        console.log('Received WebSocket message:', var_record);
    }

    let INTERVAL = 500; // 定时器间隔
    let monitorRecordChange = ref();

    function startMonitorChange(interval_ms : number) {
        monitorRecordChange = setInterval(() => {
            request_post_simu_ws("getVarValue", { command: "1", var_full_code: var_full_code.value }, handleMessage_recordValue);
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
    /* 页面标题 */
    .header {
        text-align: center;
        padding: 20px 0;
        background-color: #f5f5f5;
        border-bottom: 1px solid #ddd;
    }

    .device-name {
        font-size: 32px;
        font-weight: bold;
        color: #333;
    }

    .device-area {
        font-size: 28px;
        color: #777;
    }

    /* 记录列表 */
    .layout {
        padding: 20px;
    }

    .row {
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .var-name {
        font-size: 24px;
        font-weight: bold;
        color: #333;
    }

    .var-value {
        font-size: 24px;
        color: #1E90FF;
    }

    .content {
        font-size: 18px;
        color: #888;
    }

    .record-time {
        font-size: 16px;
        color: #666;
    }
</style>