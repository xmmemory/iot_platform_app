<template>
    <view class="container">
        <uni-section title="新建区域" subTitle="区域名称至少2个字符" type="line" padding>
            <uni-easyinput errorMessage v-model="area_name" focus placeholder="请输入内容">
            </uni-easyinput>
        </uni-section>
        <button size="default" type="primary" @click="add_area" :disabled="!(area_name.length >= 2)">
            添加分区
        </button>

        <uni-section title="当前区域列表" type="line"></uni-section>
        <uni-swipe-action ref="swipeAction">
            <uni-swipe-action-item v-for="(item, index) in all_areas" :right-options="item.options" :key="index"
                @change="swipeChange(item.id)" @click="swipeClick($event, item.id)">
                <view class="content-box">
                    <text class="content-text">{{ item.content }}</text>
                </view>
            </uni-swipe-action-item>
        </uni-swipe-action>

        <!-- 提示信息弹窗 -->
        <uni-popup ref="messageRef" type="message">
            <uni-popup-message :type="msgType" :message="messageText" :duration="2000">
            </uni-popup-message>
        </uni-popup>

    </view>
</template>

<script setup lang="ts">
    import { ref, reactive, nextTick } from 'vue';
    import { request_post_simu_ws } from "@/common/mutual/request_api.ts"
    import { onLoad } from '@dcloudio/uni-app'
    //
    const msgType = ref('success');
    const messageText = ref('这是一条成功提示');
    // 使用 ref 获取组件实例
    const messageRef = ref(null);
    const inputDialogRef = ref(null);
    //
    let area_name = ref("");
    //
    interface Area {
        id : number;
        content : string;
        options : { text : string; style ?: { backgroundColor : string } }[]; // 可选style字段
    }
    const all_areas = reactive<Area[]>([{
        id: 0,
        content: '初始化区域',  // 默认内容
        options: [
            { text: '编辑' },
            { text: '删除', style: { backgroundColor: 'rgb(255,58,49)' } }
        ]
    }]);

    onLoad(() => {
        request_post_simu_ws("getArea", { command: "all_areas" }, handleMessage_areas);
    })

    const dialogToggle = (type : string, content : string) => {
        msgType.value = type;
        messageText.value = content;
        (alertDialogRef.value as any).open();
    };

    const dialogConfirm = () => {
        console.log('点击确认');
    };

    const dialogClose = () => {
        console.log('点击关闭');
    };

    const messageToggle = (type : string) => {
        msgType.value = type;
        messageText.value = `${type}`;

        nextTick(() => {
            if (messageRef.value) {
                (messageRef.value as any).open();
            } else {
                console.error('messageRef is null or undefined');
            }
        });
    };

    function handleMessage_areas(res : { data : any[][]; }) {
        all_areas.splice(0, all_areas.length, ...res.data.map((item) => ({
            id: item.area_id,
            content: item.area_name,
            options: [
                { text: '编辑' },
                { text: '删除', style: { backgroundColor: 'rgb(255,58,49)' } }
            ]
        })))
        console.log('all_areas data:', all_areas);
    }

    function handleMessage_insertArea(res : { statusCode : number; data : any; }) {
        console.log('Received WebSocket message:', res);
        if (200 == res.statusCode) {
            messageToggle("分区添加成功");
            area_name.value = ''
            request_post_simu_ws("getArea", { command: "all_areas" }, handleMessage_areas);
        }
        else {
            dialogToggle('error', res.data);
        }
    }

    function add_area() {
        request_post_simu_ws("modifyArea", { command: "insert_area", area_name: area_name.value }, handleMessage_insertArea);
    }

    function swipeChange(index : number) {
        console.log('当前索引：', index);
    }

    function swipeClick(e : any, area_id : number) {
        const { content } = e;
        if (content.text === '删除') {
            uni.showModal({
                title: '提示',
                content: '是否删除',
                success: (res) => {
                    if (res.confirm) {
                        request_post_simu_ws("modifyArea", { command: "del_area", area_id: area_id }, handleMessage_delArea);
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        } else if (content.text === '编辑') {
            uni.showModal({
                title: '分区名称修改',
                editable: true,
                placeholderText: '请输入新的区域名称',
                success: function (res) {
                    if (res.confirm) {
                        request_post_simu_ws("modifyArea", { command: "update_area", area_id: area_id, area_name: res.content }, handleMessage_updateArea);
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        } else {
            uni.showToast({
                title: `点击了${e.content.text}按钮`,
                icon: 'none'
            });
        }
    }
    
    function handleMessage_updateArea(res : { statusCode : number; data : any; }) {
        console.log('Received WebSocket message:', res);
        if (200 == res.statusCode) {
            messageToggle("分区修改成功");
            request_post_simu_ws("getArea", { command: "all_areas" }, handleMessage_areas);
        }
        else {
            dialogToggle('error', res.data);
        }
    }

    function handleMessage_delArea(res : { statusCode : number; data : any; }) {
        console.log('Received WebSocket message:', res);
        if (200 == res.statusCode) {
            messageToggle("分区删除成功");
            request_post_simu_ws("getArea", { command: "all_areas" }, handleMessage_areas);
        }
        else {
            dialogToggle('error', res.data);
        }
    }
</script>


<style lang="scss">
    .content-box {
        flex: 1;
        /* #ifdef APP-NVUE */
        justify-content: center;
        /* #endif */
        height: 44px;
        line-height: 44px;
        padding: 0 15px;
        position: relative;
        background-color: #fff;
        border-bottom-color: #f5f5f5;
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }

    .content-text {
        font-size: 15px;
    }

    .example-body {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        justify-content: center;
        padding: 10px 0;
        background-color: #fff;
    }

    .button {
        border-color: #e5e5e5;
        border-style: solid;
        border-width: 1px;
        padding: 4px 8px;
        border-radius: 4px;
    }

    .button-text {
        font-size: 15px;
    }

    .slot-button {
        /* #ifndef APP-NVUE */
        display: flex;
        height: 100%;
        /* #endif */
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
        background-color: #ff5a5f;
    }

    .slot-button-text {
        color: #ffffff;
        font-size: 14px;
    }
</style>