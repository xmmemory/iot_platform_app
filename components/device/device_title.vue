<template name="device_title">
    <view class="header">
        <text class="device-name">{{deviceName}} | </text>
        <text class="device-area">{{deviceArea}}</text>
    </view>
</template>

<script setup lang="ts">
    import { deviceName, deviceArea } from "@/components/device/device.ts"
</script>

<style lang="scss" scoped>
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
</style>