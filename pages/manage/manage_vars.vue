<template>
    <view>
        <view class="uni-container">
            <uni-card is-full :is-shadow="false">
                <text class="uni-h2">{{device_name}}</text>
            </uni-card>
            <button size="default" type="default" @click="var_edit()">添加变量</button>
            <uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
                <uni-tr>
                    <!-- <uni-th width="150" align="center">日期</uni-th> -->
                    <uni-th width="90" align="center">变量名称</uni-th>
                    <uni-th width="50" align="center">代号</uni-th>
                    <uni-th width="80" align="center">设置</uni-th>
                </uni-tr>
                <uni-tr v-for="(item, index) in device_vars" :key="index">
                    <uni-td>
                        <view class="name">{{ item.var_name }}</view>
                    </uni-td>
                    <uni-td align="center">{{(codeMapping[item.var_type] || '未知') + item.var_code}} </uni-td>
                    <uni-td>
                        <view class="uni-group">
                            <button type="primary" size="mini"
                                @click="var_edit(item.var_id, item.var_name+item.var_code)">编辑</button>
                            <button type="warn" size="mini" @click="var_del(item.var_id, item.var_name)">删除</button>
                        </view>
                    </uni-td>
                </uni-tr>
            </uni-table>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { onShow, onLoad } from '@dcloudio/uni-app';
    import { request_post } from "@/common/mutual/request_api.ts"
    import { codeMapping } from '@/common/mapping.ts'

    // 定义响应式数据
    const loading = ref(false);
    let device_vars = ref(null);
    const device_id = ref(null);
    const device_name = ref(null);

    onLoad((options) => {
        if (options.device_id) {
            device_id.value = options.device_id || null;
            device_name.value = options.device_name || null;
        }
    });

    // 获取页面参数并设置标题
    onShow(() => {
        request_post("getVar", { command: "filter_device_id", device_id: device_id.value }, handleMessage_vars);
    });

    function handleMessage_vars(res : { data : any; }) {
        device_vars.value = res.data;
        // console.log('Received WebSocket message:', res);        
    }

    // 初始化数据
    onMounted(() => {
        // getData(pageCurrent.value);  // 获取第一页数据
    });


    function var_edit(id = null, name = null) {
        // console.log(id);
        if (id && name) {
            uni.navigateTo({
                url: `/pages/manage/edit_var?&var_id=${id}&name=${name}&device_id=${device_id.value}`,
            });
        }
        else {
            uni.navigateTo({
                url: `/pages/manage/edit_var?&device_id=${device_id.value}`,
            });
        }
    }

    function var_del(id : number, name : string) {
        uni.showModal({
            title: '提示',
            content: '是否删除',
            success: (res) => {
                if (res.confirm) {
                    request_post("modifyVar", {
                        command: "del_var",
                        var_id: id,
                    }, handleMessage_delVar);
                    console.log("[del var] id:", id, "name:", name);
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    }

    function handleMessage_delVar(res : { statusCode : number; data : string; }) {
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
        request_post("getVar", { command: "filter_device_id", device_id: device_id.value }, handleMessage_vars);
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