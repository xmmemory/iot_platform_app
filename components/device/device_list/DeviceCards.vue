<template name="DeviceCards">
    <!-- 设备卡片区域 -->
    <div class="device-cards">
        <div v-if="filteredDevices.length === 0" class="no-devices">
            此区域暂未分配设备
        </div>
        <div v-else v-for="(device, index) in filteredDevices" :key="index" class="device-card"
            @click="goToDevicePage(device)">
            <img :src="'http://app.lvrulanbio.com:7501/download/img/device/' + device.icon_addr + '.svg'" alt="暂无图标"
                class="device-icon" @error="handleImageError($event)" />
            <div class="device-info">
                <div class="device-title">{{ device.device_name }}{{ device.device_num }}</div>
                <div class="device-details">
                    {{ all_areas.find(area => area.area_id === device.area_id)?.area_name || '未知区域' }} |
                    {{ "在线" }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue";
    import { all_areas, all_devices, activeArea } from "@/components/device/device_list/ex_function.ts";

    function handleImageError(event : Event) {
        const target = event.target as HTMLImageElement;
        if (target) {
            target.src = 'http://app.lvrulanbio.com:7501/download/img/device/device_default.png';
        }
    }

    // filter device data.
    const filteredDevices = computed(() => {
        if (!Array.isArray(all_devices.value)) return [];
        return activeArea.value === 0 ?
            all_devices.value :
            all_devices.value.filter(device => device.area_id === activeArea.value);
    });

    const goToDevicePage = (device : any) => {
        let basePath = "/pages/device/device_normal";

        if (device.device_name === "氨气传感器" || device.device_name === "甲烷传感器") {
            basePath = "/pages/device/device_air";
        } else if (device.device_name === "总系统") {
            basePath = "/pages/device/device_system";
        }

        const url = getDeviceUrl(device, basePath);

        uni.navigateTo({
            url: url,
        });
    };

    const getDeviceUrl = (device : any, basePath : string) => {
        // console.log(all_areas)
        const areaName = all_areas.value.find((area : {
            area_id : any; id : number
        }) => area.area_id === device.area_id)?.area_name || "未指定分区";
        const displayArea = areaName === "全部设备" ? "" : " | " + areaName;
        const status = device.status ? device.status : "";

        return `${basePath}?id=${device.device_id}&name=${device.device_name}${status}&area=${displayArea}`;
    };
</script>

<style lang="scss" scoped>
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
</style>