import { ref } from "vue";
import { request_get } from "@/common/mutual/request_api.ts";

export let all_projects = ref([{ project_id: 1, project_name: "项目1" }]);
export let all_areas = ref(null);
export let all_devices = ref(null);
export let activeArea = ref(0); // 区域数据-当前激活的标签索引
export let selectedProject = ref(all_projects.value[0][0]);
export const showDropdown = ref(false);

export function msg_cb_projects(res : { data : any; }) {
    all_projects.value = res?.data || [];
    if (all_projects.value.length > 0) {
        selectProject(all_projects.value[0]);
        request_get("area", msg_cb_areas);
    }
}

export function msg_cb_areas(res : { data : any; }) {
    all_areas.value = res.data;
    all_areas.value.unshift({ area_id: 0, area_name: "全部设备" });
    request_get("device", msg_cb_devices);
}

export function msg_cb_devices(res : { data : any; }) {
    all_devices.value = res.data;
    uni.hideToast();
}

export let selectProject = (project : any) => {
    selectedProject.value = project.project_name;
    showDropdown.value = false;
};