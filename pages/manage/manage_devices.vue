<template>
    <view>
        <view class="uni-container">
            <uni-card is-full :is-shadow="false">
                <text class="uni-h2">设备管理</text>
            </uni-card>
            <navigator url="/pages/manage/edit_device" open-type="navigate" hover-class="other-navigator-hover"
                class="navigator-button">
                <button class="login-button" type="default">新增设备</button>
            </navigator>
            <uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
                <uni-tr>
                    <!-- <uni-th width="150" align="center">日期</uni-th> -->
                    <uni-th width="90" align="center">设备类型</uni-th>
                    <uni-th width="30" align="center">编号</uni-th>
                    <uni-th width="100" align="center">设置</uni-th>
                </uni-tr>
                <uni-tr v-for="(item, index) in all_devices" :key="index">
                    <uni-td>
                        <view class="name">{{ item[1] }}</view>
                    </uni-td>
                    <uni-td align="center">{{ item[2] }}</uni-td>
                    <uni-td>
                        <view class="uni-group">
                            <button type="default" size="mini"
                                @click="device_edit(item[0], item[1]+item[2])">编辑</button>
                            <button type="primary" size="mini" @click="vars_edit(item[0], item[1]+item[2])">配置</button>
                            <button type="warn" size="mini" @click="device_del(item[0], item[1]+item[2])">删除</button>
                        </view>
                    </uni-td>
                </uni-tr>
            </uni-table>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { onShow } from '@dcloudio/uni-app';
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"

    // 定义响应式数据
    const loading = ref(false);
    let all_devices = ref(null);

    // 获取页面参数并设置标题
    onShow(() => {
        request_post_simu_ws("getDevice", { command: "all_devices" }, handleMessage_devices);
    });

    function handleMessage_devices(res : { data : any; }) {
        all_devices.value = res.data;
        console.log('Received WebSocket message:', res);
        uni.hideToast();
    }

    // 初始化数据
    onMounted(() => {
        // getData(pageCurrent.value);  // 获取第一页数据
    });


    function device_edit(id, name) {
        uni.navigateTo({
            url: `/pages/manage/edit_device?id=${id}&name=${name}`,
        });
    }

    function vars_edit(id, name) {
        uni.navigateTo({
            url: `/pages/manage/manage_vars?device_id=${id}&name=${name}`,
        });
    }

    function device_del(id, name) {
        console.log(e);;
    }
</script>


<style>
    /* #ifndef H5 */
    /* page {
	padding-top: 85px;
} */
    /* #endif */
    .uni-group {
        display: flex;
        align-items: center;
    }
</style>