<template>
    <view class="device-detail">
        <text>设备 ID: {{ deviceId }}</text>
        <text>设备名称: {{ deviceName }}</text>
        <text>设备状态: {{ deviceStatus }}</text>
        <text>设备位置: {{ deviceLocation }}</text>
    </view>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { onLoad } from '@dcloudio/uni-app';

    const deviceId = ref<string | null>(null);
    const deviceName = ref<string | null>(null);
    const deviceStatus = ref<string | null>(null);
    const deviceLocation = ref<string | null>(null);

    onLoad((options) => {
        deviceId.value = options.id || null;
        deviceName.value = options.name || null;
        deviceStatus.value = options.status || null;
        deviceLocation.value = options.location || null;
    });
</script>