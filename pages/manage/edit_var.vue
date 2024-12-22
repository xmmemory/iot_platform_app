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
        // console.log(options)
        devicd_id.value = options.device_id || null;
        if (options.var_id) {
            var_id.value = options.var_id || null;
            // 动态设置页面标题
            uni.setNavigationBarTitle({
                title: " 变量编辑 --- " + options.name,
            });
            request_post_simu_ws("getVar", { command: "filter_var_id", var_id: var_id.value }, handleMessage_var);
        }
        else {
            uni.setNavigationBarTitle({
                title: "新建变量",
            });
        }
    })

    function handleMessage_var(res : { data : any; }) {
        moment_var.value = res.data[0];
        // console.log('Received msg moment_var:', moment_var);
    }

    function handleMessage_modifyRes(res : { statusCode : number; data : string; }) {
        var _title : string, _icon : string;
        if (200 == res.statusCode) {
            _title = "提交完成";
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
        uni.navigateBack({
            delta: 1
        });
        // console.log('Received msg moment_var.value:', res.data);
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
                var_full_code: codeMapping[item.var_type] + item.var_code,
            }, handleMessage_modifyRes);
        }
        else {
            request_post_simu_ws("modifyVar", {
                command: "insert_var",
                var_name: item.var_name,
                var_code: item.var_code,
                var_type: item.var_type,
                var_permission: item.var_permission,
                device_id: devicd_id.value,
                var_full_code: codeMapping[item.var_type] + item.var_code,
            }, handleMessage_modifyRes);
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