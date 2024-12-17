<template>
    <view class="container">
        <uni-section title="新增设备" type="line">
            <view class="example">
                <!-- 基础用法，不包含校验规则 -->
                <uni-forms ref="baseForm" :model="baseFormData" labelWidth="80px">
                    <uni-forms-item label="设备名称" required>
                        <uni-easyinput v-model="baseFormData.device_name" placeholder="请输入设备名称" />
                    </uni-forms-item>
                    <uni-forms-item label="设备序号" required>
                        <uni-easyinput v-model="baseFormData.device_num" placeholder="请输入设备序号" type="number"
                            maxlength="2" />
                    </uni-forms-item>
                    <uni-forms-item label="所属区域" required>
                        <uni-data-checkbox v-model="baseFormData.area_id" :localdata="all_areas" />
                    </uni-forms-item>
                </uni-forms>
                <button type="primary" @click="submit(baseFormData)">提交</button>
            </view>
        </uni-section>
    </view>
</template>

<script setup lang="ts">
    import { ref, defineProps, onMounted } from 'vue'
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"
    import { onLoad } from '@dcloudio/uni-app'

    let all_areas = ref(null);

    onLoad(() => {
        request_post_simu_ws("getArea", { command: "all_areas" }, handleMessage_areas);
    })

    function handleMessage_areas(res : { data : any; }) {
        res.data.unshift([0, "暂不分区"]);
        // 将 all_areas.value.data 转换为所需格式
        all_areas.value = res.data.map((item : any[]) => ({
            value: item[0],  // 将 ID 赋值给 value（即数组的第一项）
            text: item[1]  // 将名称赋值给 text（即数组的第二项）
        }))
        console.log('Received WebSocket message:', res);
    }

    // 基础表单数据
    const baseFormData = ref({
        device_name: '',
        device_num: 1,
        area_id: 0
    })

    const submit = (ref : any) => {
        console.log(ref)
        request_post_simu_ws("insertDevice", {
            device_name: ref.device_name,
            device_num: ref.device_num,
            area_id: ref.area_id,
        }, handleMessage_res);
    }

    function handleMessage_res(res : { data : any; }) {
        console.log('Received WebSocket message:', res);

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