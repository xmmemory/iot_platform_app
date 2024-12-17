<template>
    <view class="container">
        <uni-section title="新建区域" subTitle="区域名称至少2个字符" type="line" padding>
            <uni-easyinput errorMessage v-model="new_area" focus placeholder="请输入内容"></uni-easyinput>
        </uni-section>
        <button size="default" type="primary" @click="add_area" :disabled="!(new_area.length >= 2)">添加分区</button>

        <uni-section title="当前区域列表" type="line"></uni-section>
        <uni-swipe-action ref="swipeAction">
            <uni-swipe-action-item v-for="(item, index) in swipeList" :right-options="item.options" :key="item.id"
                @change="swipeChange($event, index)" @click="swipeClick($event, index)">
                <view class="content-box">
                    <text class="content-text">{{ item.content }}</text>
                </view>
            </uni-swipe-action-item>
        </uni-swipe-action>
    </view>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue';
    let new_area = ref("");
    import { onLoad } from '@dcloudio/uni-app';

    // 获取页面参数并设置标题
    onLoad(() => {
        uni.setNavigationBarTitle({
            title: "区域管理",
        });
    });

    function input(e) {
        console.log('输入内容：', e);
    };

    function add_area() {
        if (swipeList.length < 10) {
            swipeList.push({
                id: new Date().getTime(),
                options: [
                    { text: '编辑' },
                    { text: '删除', style: { backgroundColor: 'rgb(255,58,49)' } }
                ],
                content: new_area.value
            });
            uni.showToast({
                title: `添加了一条数据`,
                icon: 'none'
            });
        } else {
            uni.showToast({
                title: `最多添加十条数据`,
                icon: 'none'
            });
        }
    }

    const isOpened = ref('none');
    const swipeList = reactive([
        {
            id: 0,
            options: [
                { text: '编辑' },
                { text: '删除', style: { backgroundColor: 'rgb(255,58,49)' } }
            ],
            content: '酸洗塔'
        },
        {
            id: 1,
            options: [
                { text: '编辑' },
                { text: '删除', style: { backgroundColor: 'rgb(255,58,49)' } }
            ],
            content: '碱洗塔'
        },
        {
            id: 2,
            options: [
                { text: '编辑' },
                { text: '删除', style: { backgroundColor: 'rgb(255,58,49)' } }
            ],
            content: '水洗塔'
        }
    ]);

    // 模拟延迟赋值
    onMounted(() => {
        setTimeout(() => {
            isOpened.value = 'right';
        }, 1000);

        uni.$on('update', (res) => {
            console.log(111);
            swipeClick({
                content: { text: '添加' }
            });
        });
    });

    function change(e : string) {
        isOpened.value = e;
        console.log('返回：', e);
    }

    function swipeChange(e : any, index : number) {
        console.log('返回：', e);
        console.log('当前索引：', index);
    }

    function swipeClick(e : any, index ?: number) {
        const { content } = e;
        if (content.text === '删除') {
            uni.showModal({
                title: '提示',
                content: '是否删除',
                success: (res) => {
                    if (res.confirm) {
                        swipeList.splice(index!, 1);
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        } else if (content.text === '编辑') {
            uni.showModal({
                title: '提示',
                content: '是否编辑',
                success: (res) => {
                    if (res.confirm) {
                        swipeList.splice(index!, 1);
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