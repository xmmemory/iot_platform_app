<template name="ProjectSelector">
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
</template>

<script setup lang="ts">
    import { all_projects, showDropdown, selectedProject, selectProject } from "@/components/device/device_list/ex_function.ts";

    const toggleDropdown = () => (showDropdown.value = !showDropdown.value);
</script>

<style lang="scss" scoped>
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
</style>