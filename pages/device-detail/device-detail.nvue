<template>
    <view class="container">
        <text class="device-title">设备名称：{{ deviceName }}</text>
        <text>设备状态: {{ deviceStatus }}</text>
        <view class="device-details">
            <text>设备 ID: {{ deviceId }}</text>
            <text>设备名称: {{ deviceName }}</text>
            <text>设备位置: {{ deviceLocation }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { onLoad } from '@dcloudio/uni-app';

    const deviceId = ref<string | null>(null);
    const deviceName = ref<string | null>(null);
    const deviceStatus = ref<string | null>(null);
    const deviceLocation = ref<string | null>(null);

    // 获取页面参数并设置标题
    onLoad((options) => {
        if (options.id) {
            deviceId.value = options.id || null;
            deviceName.value = options.name || null;
            deviceStatus.value = options.status || null;
            deviceLocation.value = options.location || null;
            // 动态设置页面标题
            uni.setNavigationBarTitle({
                title: deviceName.value + " | " + deviceStatus.value,
            });
        }
    });
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