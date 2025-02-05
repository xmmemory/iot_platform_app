import { ref } from "vue";
import { request_get } from "@/common/mutual/request_api.ts";

export let all_projects = ref([{ project_id: 1, project_name: "项目1" }]);
export let all_areas = ref(null);
export let all_devices = ref(null);
export let activeArea = ref(0); // 区域数据-当前激活的标签索引
export let selectedProject = ref(all_projects.value[0][0]);
export const showDropdown = ref(false);

export function msg_cb_projects(res) {
    if (200 == res.statusCode) {
        all_projects.value = res?.data || [];
        // console.log(all_projects.value.length)
        // console.log(all_projects.value)
        if (all_projects.value.length > 0) {
            selectProject(all_projects.value[0]);
            request_get("areas", msg_cb_areas);
        }
    }
    else {
        console.log(res);
    }
}

export function msg_cb_areas(res) {
    if (200 == res.statusCode) {
        all_areas.value = res.data;
        all_areas.value.unshift({ area_id: 0, area_name: "全部设备" });
        request_get("devices", msg_cb_devices);
    }
    else {
        console.log(res);
    }
}

export function msg_cb_devices(res : { data : any; }) {
    if (200 == res.statusCode) {
        all_devices.value = res.data;
        uni.hideToast();
    }
    else {
        console.log(res);
    }
}

export let selectProject = (project : any) => {
    selectedProject.value = project.project_name;
    showDropdown.value = false;
};