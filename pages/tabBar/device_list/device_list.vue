<template>
    <template v-if="isDataReady" class="app">
        <div class="app">
            <ProjectSelector />
            <AreaSelector />
            <DeviceCards />
        </div>
    </template>
    <template v-else>
        <LoginPrompt />
    </template>
</template>

<script setup lang="ts">
    import { computed } from "vue";
    import { onShow } from '@dcloudio/uni-app'
    import { login_status } from "@/common/mutual/auth.ts";
    import { request_get } from "@/common/mutual/request_api.ts";
    //
    import { all_devices, msg_cb_projects } from "@/components/device/device_list/ex_function.ts";
    import ProjectSelector from "@/components/device/device_list/ProjectSelector.vue";
    import AreaSelector from "@/components/device/device_list/AreaSelector.vue";
    import DeviceCards from "@/components/device/device_list/DeviceCards.vue";
    import LoginPrompt from "@/components/device/device_list/LoginPrompt.vue";

    onShow(() => {
        if (login_status.value) {
            uni.showToast({
                title: '数据获取中',
                icon: 'loading',
                mask: true,
                duration: 2000
            })
            request_get("project", msg_cb_projects);
        }
    })

    const isDataReady = computed(() => {
        return login_status.value && all_devices.value;
    });
</script>


<style lang="scss" scoped>
    $app-bg-color: #f5f5f5;
    $dropdown-bg-color: #fff;
    $dropdown-hover-bg: #f0f0f0;
    $text-color: #666;

    .app {
        display: flex;
        flex-direction: column;
        background-color: #f5f5f5;
        padding: 16px;
    }
</style>