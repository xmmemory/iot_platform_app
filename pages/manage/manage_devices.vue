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
    import { request_post } from "@/common/mutual/request_api.ts"

    // 定义响应式数据
    const loading = ref(false);
    let all_devices = ref(null);

    // 获取页面参数并设置标题
    onShow(() => {
        request_post("getDevice", { command: "all_devices" }, handleMessage_devices);
    });

    function handleMessage_devices(res : { data : any; }) {
        all_devices.value = res.data.map(item => [item.device_id, item.device_name, item.device_num, item.area_id]);
        // console.log('Received msg all_devices:', all_devices);
    }

    // 初始化数据
    onMounted(() => {
        // getData(pageCurrent.value);  // 获取第一页数据
    });


    function device_edit(id, name) {
        uni.navigateTo({
            url: `/pages/manage/edit_device?device_id=${id}&device_name=${name}`,
        });
    }

    function vars_edit(id, name) {
        uni.navigateTo({
            url: `/pages/manage/manage_vars?device_id=${id}&device_name=${name}`,
        });
    }

    function device_del(id, name) {
        uni.showModal({
            title: '提示',
            content: '是否删除',
            success: (res) => {
                if (res.confirm) {
                    request_post("modifyDevice", {
                        command: "del_device",
                        device_id: id,
                    }, handleMessage_delDevice);
                    console.log("[del device] id:", id, "name:", name);
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    }
    
    function handleMessage_delDevice(res : { statusCode : number; data : string; }) {
        var _title : string, _icon : string;
        if (200 == res.statusCode) {
            _title = "删除成功";
            _icon = 'success';
        }
        else {
            _title = res.data;
            _icon = 'error';
        }
        uni.showToast({
            title: _title,
            icon: _icon,
            mask: true,
            duration: 1000
        });
        request_post("getDevice", { command: "all_devices" }, handleMessage_devices);
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