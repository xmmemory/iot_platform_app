<template>
    <template v-if="login_status">
        <div class="app">
            <!-- 项目 -->
            <div class="location">
                <div class="project" @click="toggleDropdown">
                    {{ selectedProject }}
                    <i class="icon-dropdown">▼</i>
                </div>
                <div v-if="showDropdown" class="dropdown-menu">
                    <div v-for="(project, index) in projects" :key="index" class="dropdown-item"
                        @click="selectProject(project)">
                        {{ project }}
                    </div>
                </div>
            </div>

            <div class="container">
                <!-- 标签选择 -->
                <div class="tabs-wrapper">
                    <div class="areas" ref="tabsContainer">
                        <span v-for="(area, index) in areas" :key="index"
                            :class="['area', { active: activeArea === index }]" @click="selectArea(index)">
                            {{ area }}
                        </span>
                    </div>
                    <div class="dropdown-icon" @click="toggleTabDropdown">
                        <image src="/static/svg/select.svg" style="height: 20px;width: 20px;" mode="heightFix">
                        </image>
                    </div>
                    <div v-if="showTabDropdown" class="tabs-dropdown-menu" @click.stop>
                        <div v-for="(area, index) in areas" :key="index" class="dropdown-item"
                            @click="selectArea(index)">
                            {{ area }}
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
                        <img :src="device.icon" alt="device-icon" class="device-icon" />
                        <div class="device-info">
                            <div class="device-title">{{ device.name }}{{ device.number }}</div>
                            <div class="device-details">{{ device.location }} | {{ device.status }}</div>
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
    import { onLoad } from '@dcloudio/uni-app'
    import { login_status, func_login } from "@/common/mutual/auth.ts"

    const auth_userName = ref<string>(uni.getStorageSync('auth_userName'));
    const auth_password = ref<string>(uni.getStorageSync('auth_password'));

    onLoad(() => {
        if (false == login_status.value && auth_userName.value && auth_password.value) {
            func_login(auth_userName, auth_password);
        }
    })

    // project data.
    const projects = ref(["通化除臭塔（一期）", "腾冲项目", "莱芜项目"]);
    const selectedProject = ref(projects.value[0]); // 默认项目

    // 区域数据
    const areas = ["全部区域", "酸洗塔", "碱洗塔", "水洗塔", "区域x", "区域1"];
    const activeArea = ref(0); // 当前激活的标签索引

    // 设备数据
    const devices = ref([
        { id: 1, name: "搅拌机", number: 1, location: "酸洗塔", status: "长期离线", icon: "static/device/stir.svg" },
        { id: 2, name: "搅拌机", number: 2, location: "碱洗塔", status: "长期离线", icon: "static/device/stir.svg" },
        { id: 3, name: "加药泵", number: 1, location: "酸洗塔", status: "长期离线", icon: "static/device/dosing.svg" },
        { id: 4, name: "加药泵", number: 2, location: "碱洗塔", status: "长期离线", icon: "static/device/dosing.svg" },
        { id: 5, name: "PH计", number: 1, location: "酸洗塔", status: "长期离线", icon: "static/device/PH.svg" },
        { id: 6, name: "PH计", number: 2, location: "碱洗塔", status: "长期离线", icon: "static/device/PH.svg" },
        { id: 7, name: "防腐泵", number: 1, location: "酸洗塔", status: "长期离线", icon: "static/device/waterPump.svg" },
        { id: 8, name: "防腐泵", number: 2, location: "碱洗塔", status: "长期离线", icon: "static/device/waterPump.svg" },
        { id: 9, name: "防腐泵", number: 3, location: "水洗塔", status: "长期离线", icon: "static/device/waterPump.svg" },
        { id: 10, name: "风机", number: 1, location: "区域x", status: "长期离线", icon: "static/device/fan.svg" },
        { id: 11, name: "氨气传感器", number: 1, location: "区域x", status: "长期离线", icon: "static/device/NH3.svg" },
        { id: 12, name: "氨气传感器", number: 2, location: "区域x", status: "长期离线", icon: "static/device/NH3.svg" },
        { id: 13, name: "氨气传感器", number: 3, location: "区域x", status: "长期离线", icon: "static/device/NH3.svg" },
        { id: 14, name: "氨气传感器", number: 4, location: "区域x", status: "长期离线", icon: "static/device/NH3.svg" },
        { id: 15, name: "氨气传感器", number: 5, location: "区域x", status: "离线 11 天", icon: "static/device/NH3.svg" },
        { id: 16, name: "氨气传感器", number: 6, location: "区域x", status: "在线", icon: "static/device/NH3.svg" },
        { id: 17, name: "甲烷传感器", number: 1, location: "区域x", status: "在线", icon: "static/device/CH4.svg" },
        { id: 18, name: "甲烷传感器", number: 2, location: "区域x", status: "在线", icon: "static/device/CH4.svg" },
        { id: 19, name: "甲烷传感器", number: 3, location: "区域x", status: "在线", icon: "static/device/CH4.svg" },
        { id: 20, name: "甲烷传感器", number: 4, location: "区域x", status: "在线", icon: "static/device/CH4.svg" },
        { id: 21, name: "甲烷传感器", number: 5, location: "区域x", status: "在线", icon: "static/device/CH4.svg" },
        { id: 22, name: "甲烷传感器", number: 6, location: "区域x", status: "在线", icon: "static/device/CH4.svg" },
    ]);

    // filter device data.
    const filteredDevices = computed(() => {
        if (activeArea.value === 0) {
            return devices.value; // all areas, display all devices.
        } else {
            return devices.value.filter(
                (device) => device.location === areas[activeArea.value]
            );
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
    const selectProject = (location : string) => {
        selectedProject.value = location;
        showDropdown.value = false;
    };

    // switch areas drop-down menu logic.
    const showTabDropdown = ref(false);
    const toggleTabDropdown = () => {
        showTabDropdown.value = !showTabDropdown.value;
    };

    const goToDevicePage = (device : { id : any; name : any; status : any; location : any; }) => {
        uni.navigateTo({
            url: `/pages/device/device_detail?id=${device.id}&name=${device.name}&status=${device.status}&location=${device.location}`,
        });
    };
</script>


<style lang="scss" scoped>
    .app {
        display: flex;
        flex-direction: column;
        background-color: #f5f5f5;
        padding: 16px;

        .location {
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
                        font-size: 14px;
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