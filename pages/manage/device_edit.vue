<template>
    <view class="container">
        <template v-for="(customFormData, index) in customFormDataList" :key="index">
            <uni-section :title="`变量 ${customFormData.id}`" type="line">
                <button type="primary" size="mini" @click="del(customFormData.id)" class="delete-button"> 删除 </button>
                <view class="example">
                    <uni-forms :ref="`customForm_${customFormData.id}`" :rules="customRules" labelWidth="80px"
                        :modelValue="customFormData">
                        <uni-forms-item label="变量名称" required name="name">
                            <uni-easyinput v-model="customFormData.name" placeholder="请输入名称" />
                        </uni-forms-item>
                        <uni-forms-item label="数据格式" required>
                            <uni-data-checkbox v-model="customFormData.code_type" :localdata="code_type" />
                        </uni-forms-item>
                        <uni-forms-item label="变量代号" required>
                            <view class="form-item-inline">
                                <template v-if="customFormData.code_type === 0">
                                    <text> VD </text>
                                </template>
                                <template v-else-if="customFormData.code_type === 1">
                                    <text> VW </text>
                                </template>
                                <template v-else>
                                    <text> M </text>
                                </template>
                                <uni-easyinput v-model="customFormData.code" placeholder="请输入变量代号" />
                            </view>
                        </uni-forms-item>
                        <uni-forms-item label="数据权限" required>
                            <uni-data-checkbox v-model="customFormData.permission" :localdata="code_permission" />
                        </uni-forms-item>
                        <!-- </uni-forms> -->
                    </uni-forms>
                </view>
            </uni-section>
        </template>
        <view class="button-group">
            <button type="primary" size="mini" @click="add">新增变量</button>
            <button type="primary" size="mini" @click="submit">提交</button>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue';
    import { onLoad } from '@dcloudio/uni-app'
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"

    onLoad(() => {
        request_post_simu_ws("insertDevice", { name: "all_projects", num: "all_projects", area_id: "all_projects" }, handleMessage_res);
    })

    function handleMessage_res(res : { data : any; }) {
        console.log('Received WebSocket message:', res);
        uni.hideToast();
    }

    interface CustomFormData {
        id : number;
        name : string;
        code_type : number;
        code : string;
        permission : number;
    }

    const customFormDataList = ref<CustomFormData[]>([
        { id: 0, name: '', code_type: 0, code: '', permission: 0 },
    ]);


    const code_type = reactive([
        { text: 'REAL', value: 0 },
        { text: 'INT', value: 1 },
        { text: 'BOOL', value: 2 }
    ]);

    const code_permission = reactive([
        { text: 'R', value: 0 },
        { text: 'W', value: 1 },
        { text: 'R/W', value: 2 }
    ]);

    const customRules = reactive({
        name: {
            rules: [{ required: true, errorMessage: '名称不能为空' }]
        },
        code: {
            rules: [{ required: true, errorMessage: '代号不能为空' }]
        }
    });

    const add = () => {
        const newId = customFormDataList.value.length ? customFormDataList.value[customFormDataList.value.length - 1].id + 1 : 0; // 生成新的唯一 id
        customFormDataList.value.push({
            id: newId,  // 使用新生成的 id
            name: '',   // 设置默认值
            code_type: 0, // 默认值
            code: '',   // 默认值
            permission: 0 // 默认值
        });
    };

    const del = (id : number) => {
        // 查找对应 id 的元素索引
        const index = customFormDataList.value.findIndex((v) => v.id === id);
        if (index !== -1) {
            // 删除该项
            customFormDataList.value.splice(index, 1);
        }
    };

    const submit = async () => {
        const customForm = $refs.customForm as any;  // 获取表单引用

        // 校验每个表单项
        for (let i = 0; i < customFormDataList.value.length; i++) {
            const formData = customFormDataList.value[i];
            const formRef = $refs[`customForm_${formData.id}`] as any;  // 获取每个表单项的引用

            if (formRef) {
                try {
                    await formRef.validate();  // 验证当前表单项
                    console.log(`表单 ${formData.id} 校验通过`);
                } catch (error) {
                    console.log(`表单 ${formData.id} 校验失败`, error);
                    uni.showToast({ title: `表单 ${formData.id} 校验失败`, icon: 'none' });
                    return;  // 如果某一项验证失败，停止提交
                }
            }
        }

        // 如果所有表单项都验证通过
        console.log('所有表单项校验通过');
        uni.showToast({ title: '校验通过', icon: 'success' });
    };


    onMounted(() => {
        // Set custom validation rules after component has mounted
        const customForm = $refs.customForm as any;
        customForm.setRules(customRules);
    });

    // Set the navigation bar title when the component is loaded
    uni.setNavigationBarTitle({ title: '编辑设备变量' });
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