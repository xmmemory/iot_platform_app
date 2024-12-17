<template>
    <view>
        <view class="uni-container">
            <uni-card is-full :is-shadow="false">
                <text class="uni-h2">设备管理</text>
            </uni-card>
            <navigator url="/pages/manage/new_device" open-type="navigate" hover-class="other-navigator-hover"
                class="navigator-button">
                <button class="login-button" type="default">新增设备</button>
            </navigator>
            <uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
                @selection-change="selectionChange">
                <uni-tr>
                    <!-- <uni-th width="150" align="center">日期</uni-th> -->
                    <uni-th width="70" align="center">设备类型</uni-th>
                    <uni-th width="50" align="center">编号</uni-th>
                    <uni-th width="100" align="center">设置</uni-th>
                </uni-tr>
                <uni-tr v-for="(item, index) in tableData" :key="index">
                    <!-- <uni-td>{{ item.date }}</uni-td> -->
                    <uni-td>
                        <view class="name">{{ item.name }}</view>
                    </uni-td>
                    <uni-td align="center">{{ item.address }}</uni-td>
                    <uni-td>
                        <view class="uni-group">
                            <button class="uni-button" size="mini" type="primary">编辑</button>
                            <button class="uni-button" size="mini" type="warn">删除</button>
                        </view>
                    </uni-td>
                </uni-tr>
            </uni-table>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { tableData } from './tableData.ts';
    import { onLoad } from '@dcloudio/uni-app';
    
    // 获取页面参数并设置标题
    onLoad(() => {
        uni.setNavigationBarTitle({
            title: "设备管理",
        });
    });

    // 数据类型定义
    interface TableDataItem {
        name : string;
        [key : string] : any;  // 根据需要添加具体字段
    }

    interface RequestResponse {
        data : TableDataItem[];
        total : number;
    }

    // 定义响应式数据
    const searchVal = ref('');
    const tableDataRef = ref<TableDataItem[]>([]);
    const pageSize = ref(10);  // 每页显示的条数
    const pageCurrent = ref(1);  // 当前页
    const total = ref(0);
    const loading = ref(false);
    const selectedIndexs = ref<number[]>([]);

    // 初始化数据
    onMounted(() => {
        getData(pageCurrent.value);  // 获取第一页数据
    });

    // 获取数据
    const getData = (pageCurrentVal : number, value : string = '') => {
        loading.value = true;
        pageCurrent.value = pageCurrentVal;  // 当前页更新为 pageCurrentVal
        request({
            pageSize: pageSize.value,  // 每页数据条数
            pageCurrent: pageCurrent.value,  // 当前页码
            value: value,  // 搜索值
            success: (res : RequestResponse) => {
                tableDataRef.value = res.data;  // 更新表格数据
                total.value = res.total;  // 更新数据总数
                loading.value = false;  // 加载完毕
            }
        });
    };

    // 请求数据模拟
    const request = (options : {
        pageSize : number;
        pageCurrent : number;
        success : (res : RequestResponse) => void;
        value : string;
    }) => {
        const { pageSize, pageCurrent, success, value } = options;

        // 根据分页逻辑计算开始的索引
        const startIndex = (pageCurrent - 1) * pageSize;

        // 过滤数据：首先根据搜索值过滤，再分页
        let filteredData = tableData.filter(item => {
            return !value || item.name.indexOf(value) !== -1;
        });

        // 获取当前页的数据
        const currentPageData = filteredData.slice(startIndex, startIndex + pageSize);

        // 设置总数据量
        const totalCount = filteredData.length;

        // 模拟延迟请求
        setTimeout(() => {
            success({
                data: currentPageData,  // 返回当前页的数据
                total: totalCount  // 返回数据的总数
            });
        }, 500);
    };

    // 搜索功能
    const search = () => {
        getData(1, searchVal.value);  // 搜索时请求第一页的数据
    };

    // 选择项处理
    const selectedItems = () => {
        return selectedIndexs.value.map(i => tableDataRef.value[i]);
    };

    // 处理多选变化
    const selectionChange = (e : any) => {
        selectedIndexs.value = e.detail.index;
    };

    // 分页变化
    const change = (e : any) => {
        // 清除选择项
        selectedIndexs.value.length = 0;
        getData(e.current);  // 根据当前页重新请求数据
    };

    // 批量删除
    const delTable = () => {
        console.log(selectedItems());
    };
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