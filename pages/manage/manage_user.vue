<template>
    <view class="container">
        <uni-section title="新建用户" subTitle="用户名称至少2个字符" type="line" padding>
            <uni-easyinput errorMessage v-model="user_name" focus placeholder="请输入用户名">
            </uni-easyinput>
            <uni-easyinput type="password" style="margin-top: 20rpx;" errorMessage v-model="user_password" focus
                placeholder="请输入密码">
            </uni-easyinput>
            <uni-easyinput type="password" style="margin-top: 20rpx;" errorMessage v-model="user_password_confirm" focus
                placeholder="请输入密码,进行二次确认">
            </uni-easyinput>
        </uni-section>
        <button size="default" type="primary" @click="add_user"
            :disabled="!(user_name.length >= 2) ||  !(user_password.length >= 2) ">
            添加新用户
        </button>

        <uni-section title="当前用户列表" type="line"></uni-section>
        <uni-swipe-action ref="swipeAction">
            <uni-swipe-action-item v-for="(item, index) in all_users" :right-options="item.options" :key="index"
                @change="swipeChange(item.id)" @click="swipeClick($event, item.id)">
                <view class="content-box">
                    <text class="content-text">{{ item.name }}</text>
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
    import { request_del, request_get, request_post, request_put } from "@/common/mutual/request_api.ts"
    import { onLoad } from '@dcloudio/uni-app'
    //
    let user_name = ref("");
    let user_password = ref("");
    let user_password_confirm = ref("");

    interface User {
        id : number;
        name : string;
        options : { text : string; style ?: { backgroundColor : string } }[]; // 可选style字段
    }
    let all_users = reactive<User[]>([{
        id: 0,
        name: '请输入名称',
        options: [
            // { text: '编辑' },
            { text: '删除', style: { backgroundColor: 'rgb(255,58,49)' } }
        ]
    }]);
    //
    const msgType = ref('success');
    const messageText = ref('');
    // 使用 ref 获取组件实例
    const messageRef = ref(null);
    //
    onLoad(() => {
        request_get("user", msg_cb_users);
    })

    function msg_cb_users(res : { data : any[]; }) {
        all_users.splice(0, all_users.length, ...res.data.map((item) => ({
            id: item.id,
            name: item.name + " | " + item.permission,
            options: [
                { text: '删除', style: { backgroundColor: 'rgb(255,58,49)' } }
            ]
        })));
        // console.log('all_users data:', all_users);
    }

    const dialogToggle = (type : string, content : string) => {
        msgType.value = type;
        messageText.value = content;
        (alertDialogRef.value as any).open();
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

    function msg_cb_create_user(res : { statusCode : number; data : any; }) {
        console.log('Received WebSocket message:', res);
        if (200 == res.statusCode) {
            messageToggle("用户添加成功");
            user_name.value = ''
            user_password.value = ''
            request_get("user", msg_cb_users);
        }
        else {
            dialogToggle('error', res.data);
        }
    }

    function add_user() {
        if (user_password.value != user_password_confirm.value) {
            uni.showToast({
                title: "两次密码不一致",
                icon: "error",
                mask: true,
                duration: 800
            });
            return;
        }
        request_post("user",
            { user_name: user_name.value, user_password: user_password.value },
            msg_cb_create_user);
    }

    function swipeChange(index : number) {
        console.log('当前索引：', index);
    }

    function swipeClick(e : any, user_id : number) {
        const { content } = e;
        if (content.text === '删除') {
            uni.showModal({
                title: '提示',
                content: '是否删除',
                success: (res) => {
                    if (res.confirm) {
                        request_del("user", { user_id: user_id }, msg_cb_del);
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        } else if (content.text === '编辑') {
            uni.showModal({
                title: '用户名称修改',
                editable: true,
                placeholderText: '请输入新的用户名称',
                success: function (res) {
                    if (res.confirm) {
                        request_put("user", { user_name: res.content }, msg_cb_modify);
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

    function msg_cb_modify(res : { statusCode : number; data : any; }) {
        console.log('Received WebSocket message:', res);
        if (200 == res.statusCode) {
            messageToggle("用户修改成功");
            request_get("user", msg_cb_users);
        }
        else {
            dialogToggle('error', res.data);
        }
    }

    function msg_cb_del(res : { statusCode : number; data : any; }) {
        console.log('Received WebSocket message:', res);
        if (200 == res.statusCode) {
            messageToggle("用户删除成功");
            request_get("user", msg_cb_users);
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