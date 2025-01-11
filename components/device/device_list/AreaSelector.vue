<template name="AreaSelector">
    <!-- 区域选择 -->
    <div class="tabs-wrapper">
        <div class="areas" ref="tabsContainer">
            <span v-for="(area, index) in all_areas" :key="index" :class="['area', { active: activeArea === index }]"
                @click="selectArea(index)">
                {{ area.area_name }}
            </span>
        </div>
        <div class="dropdown-icon" @click="toggleTabDropdown">
            <image src="http://app.lvrulanbio.com:7501/download/img/icon/down_select.svg" style="height: 50rpx;width: 10rpx;" mode="heightFix">
            </image>
        </div>
        <div v-if="showTabDropdown" class="tabs-dropdown-menu" @click.stop>
            <div v-for="(area, index) in all_areas" :key="index" class="dropdown-item" @click="selectArea(index)">
                {{ area.area_name }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { all_areas, activeArea } from "@/components/device/device_list/ex_function.ts";

    // switch areas drop-down menu logic.
    const showTabDropdown = ref(false);

    // switch area.
    const selectArea = (index : number) => {
        activeArea.value = index;
        showTabDropdown.value = false; // hide area drop-down menu.
    };

    const toggleTabDropdown = () => {
        showTabDropdown.value = !showTabDropdown.value;
    };
</script>

<style lang="scss" scoped>
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
    }
</style>