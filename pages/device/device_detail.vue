<template>
    <view class="container">
        <template v-for="(item, index) in device_vars" :key="item.var_id">
            <uni-card :title=" item.var_name" sub-title="deviceArea" :extra="deviceArea" :thumbnail="avatar"
                @click="onClick">
                <template v-slot:title>
                    <uni-list>
                        <uni-list-item :show-switch=" true" :title="item.var_name" />
                    </uni-list>
                </template>
                <!-- <text class="uni-body">这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。</text>
                <uni-td>
                    <view class="uni-group">
                        <button type="primary" size="mini">开启</button>
                        <button type="warn" size="mini">关闭</button>
                    </view>
                </uni-td> -->
            </uni-card>
        </template>
    </view>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { onLoad } from '@dcloudio/uni-app';
    // import { codeMapping } from '@/common/mapping.ts'
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"

    const device_id = ref<string | null>(null);
    const deviceName = ref<string | null>(null);
    const deviceStatus = ref<string | null>(null);
    const deviceArea = ref<string | null>(null);
    let device_vars = ref(null);

    const avatar = 'https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png';

    function onClick(e) {
        console.log(e)
    }

    // 获取页面参数并设置标题
    onLoad((options) => {
        if (options.id) {
            device_id.value = options.id || null;
            deviceName.value = options.name || null;
            deviceStatus.value = options.status || null;
            deviceArea.value = options.area || null;
            // 动态设置页面标题
            uni.setNavigationBarTitle({
                title: deviceName.value + " | " + deviceStatus.value,
            });
        }
        request_post_simu_ws("getVar", { command: "filter_device_id", device_id: device_id.value }, handleMessage_vars);
    });

    function handleMessage_vars(res : { data : any; }) {
        device_vars.value = res.data;
        console.log('Received WebSocket message:', res);
        uni.hideToast();
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
</style>