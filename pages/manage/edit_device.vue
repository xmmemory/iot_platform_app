<template>
    <view class="container">
        <uni-section title="新增设备" type="line">
            <view class="example">
                <!-- 基础用法，不包含校验规则 -->
                <uni-forms ref="baseForm" :model="moment_device" labelWidth="80px">
                    <uni-forms-item label="设备名称" required>
                        <uni-easyinput v-model="moment_device.device_name" placeholder="请输入设备名称" />
                    </uni-forms-item>
                    <uni-forms-item label="设备序号" required>
                        <uni-easyinput v-model="moment_device.device_num" placeholder="请输入设备序号" type="number"
                            maxlength="2" />
                    </uni-forms-item>
                    <uni-forms-item label="所属区域" required>
                        <uni-data-checkbox v-model="moment_device.area_id" :localdata="all_areas" />
                    </uni-forms-item>
                </uni-forms>
                <button type="primary" @click="submit(moment_device)"
                    :disabled="!(moment_device.device_name) || !(moment_device.device_num)">提交</button>
            </view>
        </uni-section>
    </view>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"
    import { onLoad } from '@dcloudio/uni-app'

    let all_areas = ref(null);
    const device_id = ref<number | null>(null);

    interface DeviceStr {
        device_name : string;
        device_num : number;
        area_id : number;
    }

    let moment_device = ref<DeviceStr>({
        device_name: '',
        device_num: 1,
        area_id: 0,
    });

    onLoad((options) => {
        device_id.value = options.device_id || null;
        request_post_simu_ws("getArea", { command: "all_areas" }, handleMessage_areas);
        if (device_id.value) {
            request_post_simu_ws("getDevice", { command: "filter_device_id", device_id: device_id.value }, handleMessage_devices);
        }
    })

    function handleMessage_devices(res : { data : any; }) {
        moment_device.value = res.data[0];
        // console.log('Received WebSocket moment_device:', moment_device);
    }

    function handleMessage_areas(res : { data : any; }) {
        all_areas.value = res.data.map((item : { area_id : number; area_name : string; }) => ({
            value: item.area_id,
            text: item.area_name
        }))
        all_areas.value.unshift({ value: 0, text: "暂不分区" });
        // console.log('Received WebSocket all_areas:', all_areas);
    }

    const submit = (ref : any) => {
        console.log(ref)
        if (device_id.value) {
            request_post_simu_ws("modifyDevice", {
                command: "update_device",
                device_name: ref.device_name,
                device_num: ref.device_num,
                area_id: ref.area_id,
                device_id: device_id.value,
            }, handleMessage_modifyRes);
        }
        else {
            request_post_simu_ws("modifyDevice", {
                command: "insert_device",
                device_name: ref.device_name,
                device_num: ref.device_num,
                area_id: ref.area_id,
            }, handleMessage_modifyRes);
        }
    }

    function handleMessage_modifyRes(res : { statusCode : number; data : string; }) {
        if (200 == res.statusCode) {
            uni.showToast({
                title: "修改完成",
                icon: 'success',
                mask: true,
                duration: 600
            });
        }
        else {
            uni.showToast({
                title: res.data,
                icon: 'error',
                mask: true,
                duration: 1000
            });
        }
        console.log('Received WebSocket message:', res);
        uni.navigateBack({
            delta: 1
        });
    }
</script>


<style lang="scss">
    .example {
        padding: 15px;
        background-color: #fff;
    }

    .segmented-control {
        margin-bottom: 15px;
    }

    .button-group {
        margin-top: 15px;
        display: flex;
        justify-content: space-around;
    }

    .form-item {
        display: flex;
        align-items: center;
        flex: 1;
    }

    .button {
        display: flex;
        align-items: center;
        height: 35px;
        line-height: 35px;
        margin-left: 10px;
    }
</style>