<template>
    <view>
        <template v-if="Array.isArray(var_record)">
            <device_title />
            <!-- 记录列表 -->
            <view class="layout">
                <!-- <uni-section :title="'数据范围筛选'" type="line"></uni-section> -->
                <text class="data-slecte-title">数据范围筛选:</text>
                <view class="example-body">
                    <uni-datetime-picker v-model="datetimeRange" type="datetimerange" rangeSeparator="至" />
                    <view style="margin-bottom: 30rpx;"></view>
                </view>
                <view class="row" v-for="(item) in filteredRecords" :key="item.created_at">
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
                        <template v-else-if="var_name.includes('频率')">
                            <text class="var-value">{{item.value}}Hz</text>
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
    import { ref, computed } from "vue";
    import { onLoad, onUnload } from '@dcloudio/uni-app';
    import { request_get } from "@/common/mutual/request_api.ts"
    import { varStatusMapping } from '@/common/mapping.ts'
    import { deviceName, deviceArea } from "@/components/device/device.ts"
    import device_title from "@/components/device/device_title.vue";

    const var_full_code = ref<string | null>(null);
    const var_name = ref<string | null>(null);
    const var_type = ref<string | null>(null);
    let var_record = ref(null);

    // 过滤函数
    const filteredRecords = computed(() => {
        const [start, end] = datetimeRange.value.map(date => new Date(date).getTime())
        return var_record.value.filter(item => {
            const createdAt = new Date(item.created_at).getTime()
            return createdAt >= start && createdAt <= end
        })
    })

    const datetimeRange = ref([
        getDateTime(Date.now() - 5 * 24 * 3600000),
        getDateTime(Date.now() + 5 * 24 * 3600000)
    ])

    function getDateTime(date) {
        return `${getDate(date)} ${getTime(date)}`
    }

    function getDate(date) {
        date = new Date(date)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}-${addZero(month)}-${addZero(day)}`
    }

    function getTime(date : string | number | Date) {
        date = new Date(date)
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        // return `${addZero(hour)}:${addZero(minute)}` : `${addZero(hour)}:${addZero(minute)}:${addZero(second)}`
        // return `${addZero(hour)}:${addZero(minute)}`
        return `${addZero(hour)}:${addZero(minute)}:${addZero(second)}`
    }

    function addZero(num) {
        if (num < 10) {
            num = `0${num}`
        }
        return num
    }

    // 获取页面参数并设置标题
    onLoad((options) => {
        // console.log(options)
        if (options.var_full_code) {
            var_full_code.value = options.var_full_code || null;
            var_name.value = options.name || null;
            var_type.value = options.type || null;
            deviceName.value = options.deviceName || null;
            deviceArea.value = options.deviceArea || null;
            // TODO
            request_get("getVarValue", { command: "1", var_full_code: var_full_code.value }, handleMessage_recordValue);
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
        // 将 "T" 替换为 " ":
        var_record.value = var_record.value.map((item : any) => ({
            ...item,
            created_at: item.created_at.replace('T', ' '),
        }));
        // console.log('Received WebSocket message:', var_record);
    }

    let INTERVAL = 500; // 定时器间隔
    let monitorRecordChange = ref();

    function startMonitorChange(interval_ms : number) {
        monitorRecordChange = setInterval(() => {
            // TODO
            request_post("getVarValue", { command: "1", var_full_code: var_full_code.value }, handleMessage_recordValue);
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

    .data-slecte-title {
        font-size: 22px;
        font-weight: bold;
        color: #e67137;
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