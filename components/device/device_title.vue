<template>
    <view class="header">
        <text class="device-name">{{deviceName}}</text>
        <text v-if="deviceArea && 'null' != deviceArea" class="device-area">{{deviceArea}}</text>
    </view>
</template>

<script setup lang="ts">
    defineProps({
        deviceName: String,
        deviceArea: String
    });
</script>

<style lang="scss" scoped>
    /* 页面标题 */
    .header {
        text-align: center;
        padding: 18px 0;
        background-color: #f5f5f5;
        border-bottom: 1px solid #ddd;
    }

    .device-name {
        font-size: 28px;
        font-weight: bold;
        color: #333;
    }

    .device-area {
        font-size: 26px;
        color: #777;
    }
</style>
