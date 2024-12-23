<template>
    <template v-if="login_status && all_areas && all_devices">
        <div class="app">
            <!-- 项目 -->
            <div class="area">
                <div class="project" @click="toggleDropdown">
                    {{ selectedProject}}
                    <i v-if="all_projects.length > 1" class="icon-dropdown">▼</i>
                </div>
                <div v-if="showDropdown && all_projects.length > 1" class="dropdown-menu">
                    <div v-for="(project, index) in all_projects" :key="index" class="dropdown-item"
                        @click="selectProject(project)">
                        {{ project.project_name }}
                    </div>
                </div>
            </div>

            <div class="container">
                <!-- 区域选择 -->
                <div class="tabs-wrapper">
                    <div class="areas" ref="tabsContainer">
                        <span v-for="(area, index) in all_areas" :key="index"
                            :class="['area', { active: activeArea === index }]" @click="selectArea(index)">
                            {{ area[1] }}
                        </span>
                    </div>
                    <div class="dropdown-icon" @click="toggleTabDropdown">
                        <image src="/static/svg/select.svg" style="height: 20px;width: 20px;" mode="heightFix">
                        </image>
                    </div>
                    <div v-if="showTabDropdown" class="tabs-dropdown-menu" @click.stop>
                        <div v-for="(area, index) in all_areas" :key="index" class="dropdown-item"
                            @click="selectArea(index)">
                            {{ area[1] }}
                        </div>
                    </div>
                </div>
                <!-- 设备卡片区域 -->
                <div class="device-cards">
                    <div v-if="filteredDevices.length === 0" class="no-devices">
                        此区域暂未分配设备
                    </div>
                    <div v-else v-for="(device, index) in filteredDevices" :key="index" class="device-card"
                        @click="goToDevicePage(device)">
                        <img :src="getDeviceIconUrl(device[1]+device[2])" alt="暂无图标" class="device-icon" />
                        <div class="device-info">
                            <div class="device-title">{{ device[1] }}{{ device[2] }}</div>
                            <div class="device-details">{{ all_areas.find(area => area[0] === device[3])?.[1] }} |
                                {{ "在线" }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <view class="login-container">
            <image class="company-logo" src="/static/company_logo/s-logo.png" mode="heightFix"></image>
            <navigator url="/pages/tabBar/ucenter/ucenter" open-type="switchTab" hover-class="other-navigator-hover">
                <button class="login-button" type="default">登录，体验完整功能</button>
            </navigator>
        </view>
    </template>
</template>

<script setup lang="ts">
    import { ref, computed } from "vue";
    import { onLoad, onShow } from '@dcloudio/uni-app'
    import { login_status } from "@/common/mutual/auth.ts"
    import { request_post_simu_ws } from "@/common/mutual/request_post.ts"

    const auth_userName = ref<string>(uni.getStorageSync('auth_userName'));
    const auth_password = ref<string>(uni.getStorageSync('auth_password'));

    // project data.
    let all_projects = ref([
        { project_id: 1, project_name: "项目1" },
        { project_id: 1, project_name: "项目2" }
    ]);
    let selectedProject = ref(all_projects.value[0][0]);
    let all_areas = ref(null);
    let all_devices = ref(null);

    onLoad(() => {
        ;
    })

    // 定义设备图标类型
    type DeviceIcons = {
        [key : string] : string;
    };

    // 定义设备图标对象
    const deviceIcons : DeviceIcons = {
        "搅拌机": 'http://49.232.133.59:7500/download/img/device/stir.svg',
        "搅拌机1": 'http://49.232.133.59:7500/download/img/device/stir_1.svg',
        "搅拌机2": 'http://49.232.133.59:7500/download/img/device/stir_2.svg',
        "加药泵": 'http://49.232.133.59:7500/download/img/device/dosing.svg',
        "加药泵1": 'http://49.232.133.59:7500/download/img/device/dosing_1.svg',
        "加药泵2": 'http://49.232.133.59:7500/download/img/device/dosing_2.svg',
        "防腐泵1": 'http://49.232.133.59:7500/download/img/device/waterPump_1.svg',
        "防腐泵2": 'http://49.232.133.59:7500/download/img/device/waterPump_2.svg',
        "防腐泵3": 'http://49.232.133.59:7500/download/img/device/waterPump_3.svg',
        "风机null": 'http://49.232.133.59:7500/download/img/device/fan.svg',
        "PH计1": 'http://49.232.133.59:7500/download/img/device/PH_1.svg',
        "PH计2": 'http://49.232.133.59:7500/download/img/device/PH_2.svg',
        "氨气传感器1": 'http://49.232.133.59:7500/download/img/device/NH3_1.svg',
        "氨气传感器2": 'http://49.232.133.59:7500/download/img/device/NH3_1.svg',
        "氨气传感器3": 'http://49.232.133.59:7500/download/img/device/NH3_1.svg',
        "氨气传感器4": 'http://49.232.133.59:7500/download/img/device/NH3_1.svg',
        "氨气传感器5": 'http://49.232.133.59:7500/download/img/device/NH3_1.svg',
        "氨气传感器6": 'http://49.232.133.59:7500/download/img/device/NH3_1.svg',
        "氨气传感器7": 'http://49.232.133.59:7500/download/img/device/NH3_1.svg',
        "甲烷传感器1": 'http://49.232.133.59:7500/download/img/device/CH4_2.svg',
        "甲烷传感器2": 'http://49.232.133.59:7500/download/img/device/CH4_2.svg',
        "甲烷传感器3": 'http://49.232.133.59:7500/download/img/device/CH4_2.svg',
        "甲烷传感器4": 'http://49.232.133.59:7500/download/img/device/CH4_2.svg',
        "甲烷传感器5": 'http://49.232.133.59:7500/download/img/device/CH4_2.svg',
        "甲烷传感器6": 'http://49.232.133.59:7500/download/img/device/CH4_2.svg',
        "甲烷传感器7": 'http://49.232.133.59:7500/download/img/device/CH4_2.svg',
        "总系统null": 'http://49.232.133.59:7500/download/img/device/system.svg'
    };

    function getDeviceIconUrl(device_name : string) {
        // console.log(device_name)
        // 如果 device Icons 对象中存在 device_name，则返回对应的 URL，否则返回默认图标
        return deviceIcons[device_name] || 'static/img/icon_device/device_default.png';
    }

    onShow(() => {
        if (login_status.value) {
            uni.showToast({
                title: '数据获取中',
                icon: 'loading',
                mask: true,
                duration: 2000
            })
            request_post_simu_ws("getProject", { command: "all_projects" }, handleMessage_projects);
        }
    })

    function handleMessage_projects(res : { data : any; }) {
        all_projects.value = res.data;
        selectProject(all_projects.value[0]);
        // console.log('Received msg all_projects:', all_projects);
        request_post_simu_ws("getArea", { command: "all_areas" }, handleMessage_areas);
    }

    function handleMessage_areas(res : { data : any; }) {
        all_areas.value = res.data.map(item => [item.area_id, item.area_name]);
        all_areas.value.unshift([0, "全部设备"]);
        // console.log('Received msg all_areas:', all_areas);
        request_post_simu_ws("getDevice", { command: "all_devices" }, handleMessage_devices);
    }

    function handleMessage_devices(res : { data : any; }) {
        all_devices.value = res.data.map(item => [item.device_id, item.device_name, item.device_num, item.area_id]);
        // console.log('Received msg all_devices:', all_devices);
        uni.hideToast();
    }

    // 区域数据
    const activeArea = ref(0); // 当前激活的标签索引

    // filter device data.
    const filteredDevices = computed(() => {
        if (!Array.isArray(all_devices.value)) {
            return []; // 如果 all_devices 不是数组，返回空数组
        }
        if (activeArea.value === 0) {
            // 如果选择了“全部区域”，返回所有设备
            return all_devices.value;
        } else {
            // 否则，过滤设备，返回匹配当前区域ID的设备
            return all_devices.value.filter(device => device[3] === activeArea.value);
        }
    });


    // switch area.
    const selectArea = (index : number) => {
        activeArea.value = index;
        showTabDropdown.value = false; // hide area drop-down menu.
    };

    // switch project drop-down menu logic.
    const showDropdown = ref(false);
    const toggleDropdown = () => (showDropdown.value = !showDropdown.value);
    const selectProject = (project : any) => {
        selectedProject.value = project.project_name;
        showDropdown.value = false;
    };

    // switch areas drop-down menu logic.
    const showTabDropdown = ref(false);
    const toggleTabDropdown = () => {
        showTabDropdown.value = !showTabDropdown.value;
    };

    const goToDevicePage = (device : { id : any; device_name : any; status : any; area : any; }) => {
        let url = `/pages/device/device_detail_normal?id=${device[0]}&name=${device[1]}${device[2] ? device[2] : ''}&area=${all_areas.value.find(area => area[0] === device[3])?.[1] === "全部设备"
            ? "未指定分区"
            : all_areas.value.find(area => area[0] === device[3])?.[1]
            }`;
        console.log(device[1])
        if (device[1] == "总系统") {
            url = `/pages/device/device_detail_system?id=${device[0]}&name=${device[1]}${device[2] ? device[2] : ''}&area=${all_areas.value.find(area => area[0] === device[3])?.[1] === "全部设备"
                ? "未指定分区"
                : all_areas.value.find(area => area[0] === device[3])?.[1]
                }`;
        } else if (device[1] == "氨气传感器" || device[1] == "甲烷传感器") {
            url = `/pages/device/device_detail?id=${device[0]}&name=${device[1]}${device[2] ? device[2] : ''}&area=${all_areas.value.find(area => area[0] === device[3])?.[1] === "全部设备"
                ? "未指定分区"
                : all_areas.value.find(area => area[0] === device[3])?.[1]
                }`;
        }
        uni.navigateTo({
            url: url,
        });
    };
</script>


<style lang="scss" scoped>
    .app {
        display: flex;
        flex-direction: column;
        background-color: #f5f5f5;
        padding: 16px;

        .area {
            position: relative;
            margin-bottom: 16px;

            .project {
                display: flex;
                align-items: center;
                font-size: 18px;
                cursor: pointer;

                i {
                    margin-left: 8px;
                    font-size: 14px;
                }
            }

            .dropdown-menu {
                position: absolute;
                top: 40px;
                left: 0;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                z-index: 111;
                /* make sure drop-down menu above other contents. */

                .dropdown-item {
                    padding: 10px 16px;
                    font-size: 16px;
                    cursor: pointer;

                    &:hover {
                        background-color: #f0f0f0;
                    }
                }
            }
        }

        .tabs-wrapper {
            position: relative;
            /* 确保下拉菜单相对于 .tabs-wrapper 定位 */
            display: flex;
            align-items: center;
            width: 100%;
            overflow: visible;
            /* 确保不会裁剪下拉菜单 */

            .areas {
                display: flex;
                gap: 16px;
                overflow-x: auto;
                white-space: nowrap;
                padding: 8px 0;
                flex: 1;

                &::-webkit-scrollbar {
                    display: none; // 隐藏滚动条
                }

                .area {
                    flex-shrink: 0;
                    padding: 8px 16px;
                    font-size: 16px;
                    cursor: pointer;
                    color: #666;
                    border-radius: 8px;

                    &.active {
                        color: #000;
                        font-weight: bold;
                        background-color: #e0e0e0;
                    }
                }
            }

            .dropdown-icon {
                padding: 20px;
                cursor: pointer;

                /* 确保最高层级 */
                .icon {
                    width: 16px;
                    height: 16px;
                    object-fit: contain;
                    vertical-align: middle;
                    /* 保证居中对齐 */
                }
            }
        }

        .tabs-dropdown-menu {
            position: absolute;
            top: calc(100% + 8px);
            /* 菜单位于触发器下方 */
            right: 0;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            /* 高优先级显示 */
            width: auto;
            max-width: 100%;
            overflow: hidden;

            .dropdown-item {
                padding: 10px 16px;
                font-size: 16px;
                cursor: pointer;

                &:hover {
                    background: #f0f0f0;
                }
            }
        }

        .device-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-top: 16px;

            .no-devices {
                grid-column: 1 / -1;
                /* 占据所有列 */
                text-align: center;
                font-size: 18px;
                color: #888;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 8px;
            }

            .device-card {
                background-color: #fff;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;

                .device-icon {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    margin-bottom: 10px;
                }

                .device-info {
                    .device-title {
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .device-details {
                        font-size: 16px;
                        color: #666;
                    }
                }
            }
        }
    }

    //
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
    }

    .company-logo {
        height: 100px;
        width: 100px;
        margin: 300rpx 18% 120rpx 18%;
    }

    .login-text {
        font-size: 18px;
        margin-bottom: 20px;
    }

    .login-button {
        background-color: #00c853;
        /* 绿色背景 */
        color: white;
        /* 白色文字 */
        padding: 10px 20px;
        /* 内边距 */
        border-radius: 5px;
        /* 圆角 */
        font-size: 20px;
        /* 字体大小 */
        border: none;
        /* 无边框 */
        cursor: pointer;
        /* 鼠标悬停时显示指针 */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        /* 阴影 */
        transition: background-color 0.3s, transform 0.3s;
        /* 过渡效果 */
    }

    .login-button:hover {
        background-color: #00b359;
        /* 悬停时的背景颜色 */
        transform: translateY(-2px);
        /* 悬停时的上移效果 */
    }
</style>