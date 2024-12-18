<template>
    <view class="container">
        <view class="example">
            <uni-forms labelWidth="80px">
                <uni-forms-item label="变量名称" required name="name">
                    <uni-easyinput v-model="moment_var.var_name" placeholder="请输入名称" />
                </uni-forms-item>
                <uni-forms-item label="数据格式" required>
                    <uni-data-checkbox v-model="moment_var.var_type" :localdata="code_type" />
                </uni-forms-item>
                <uni-forms-item label="变量代号" required>
                    <view class="form-item-inline">
                        <text>{{ codeMapping[moment_var.var_type] || '未知' }}</text>
                        <uni-easyinput v-model="moment_var.var_code" placeholder="请输入变量代号" />
                    </view>
                </uni-forms-item>
                <uni-forms-item label="数据权限" required>
                    <uni-data-checkbox v-model="moment_var.var_permission" :localdata="code_permission" />
                </uni-forms-item>
            </uni-forms>

            <button type="primary" :disabled="!(moment_var.var_name) || !(moment_var.var_code)"
                @click="update_var(moment_var)">
                {{ var_id ? '提交修改' : '添加变量' }}
            </button>

        </view>
    </view>
</template>


<script setup lang="ts">
    import { ref, reactive } from 'vue';
    import { onLoad } from '@dcloudio/uni-app'
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"
    import { codeMapping } from '@/common/mapping.ts'

    const devicd_id = ref<number | null>(null);
    const var_id = ref<number | null>(null);

    interface VarStr {
        var_name : string;
        var_code : string;
        var_type : string;
        var_permission : string;
    }

    let moment_var = ref<VarStr>({
        var_name: '',
        var_code: '',
        var_type: 'REAL',
        var_permission: 'R',
    });

    // 获取页面参数并设置标题
    onLoad((options) => {
        console.log(options)
        devicd_id.value = options.device_id || null;
        if (options.var_id) {
            var_id.value = options.var_id || null;
            // 动态设置页面标题
            uni.setNavigationBarTitle({
                title: " 变量编辑 --- " + options.name,
            });
            request_post_simu_ws("getVar", { command: "filter_var_id", var_id: var_id.value }, handleMessage_res);
        }
        else {
            console.log("新建变量")
            uni.setNavigationBarTitle({
                title: "新建变量",
            });
        }
    })

    function handleMessage_res(res : { data : any; }) {
        const data = res.data[0];  // 获取第一个子数组
        moment_var.value.var_name = data[1];
        moment_var.value.var_code = data[2];
        moment_var.value.var_type = data[3];
        moment_var.value.var_permission = data[4];
        console.log('Received WebSocket moment_var.value:', moment_var.value);
        uni.hideToast();
    }

    function handleMessage_insertVar(res : { data : any; }) {
        console.log('Received WebSocket moment_var.value:', res.data);
        uni.hideToast();
    }

    const code_type = reactive([
        { text: 'REAL', value: 'REAL' },
        { text: 'INT', value: 'INT' },
        { text: 'BOOL', value: 'BOOL' }
    ]);

    const code_permission = reactive([
        { text: 'R', value: 'R' },
        { text: 'W', value: 'W' },
        { text: 'R/W', value: 'R/W' }
    ]);

    const update_var = (item : VarStr) => {
        if (var_id.value) {
            request_post_simu_ws("modifyVar", {
                command: "update_var",
                var_id: var_id.value,
                var_name: item.var_name,
                var_code: item.var_code,
                var_type: item.var_type,
                var_permission: item.var_permission,
                device_id: devicd_id.value,
            }, handleMessage_insertVar);
        }
        else {
            request_post_simu_ws("modifyVar", {
                command: "insert_var",
                var_name: item.var_name,
                var_code: item.var_code,
                var_type: item.var_type,
                var_permission: item.var_permission,
                device_id: devicd_id.value,
            }, handleMessage_insertVar);
        }
    };
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
        // display: flex;
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

    .form-item-inline {
        display: flex;
        align-items: center;
        /* 垂直居中 */
    }

    .form-item-inline text {
        margin-right: 10px;
        /* 给 text 元素和 uni-easyinput 之间添加一些间距 */
    }

    .delete-button {
        position: absolute;
        top: 10px;
        right: 10px;
    }
</style>