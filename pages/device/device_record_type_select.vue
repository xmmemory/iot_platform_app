<template name="record_type_select">
  <view class="tab-container">
    <view 
      v-for="(tab, index) in tabs" 
      :key="index"
      ref="tabRefs"
      class="tab-item" 
      :class="{'active': activeTab === tab}" 
      @click="selectTab(tab)"
    >
      {{ tab }}
    </view>
    <view class="indicator" :style="{left: indicatorLeft + 'px', width: tabWidth + 'px'}"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  modelValue?: string;
  tabs?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => ['总览', '报表', '数据']
});

const emit = defineEmits(['update:modelValue', 'change']);

const activeTab = ref(props.modelValue || props.tabs[1]);
const tabRefs = ref<HTMLElement[]>([]);

const indicatorLeft = computed(() => {
  const index = props.tabs.indexOf(activeTab.value);
  if (tabRefs.value[index]) {
    return tabRefs.value[index].offsetLeft;
  }
  return 0;
});

const tabWidth = computed(() => {
  const index = props.tabs.indexOf(activeTab.value);
  if (tabRefs.value[index]) {
    return tabRefs.value[index].offsetWidth;
  }
  return 0;
});

function selectTab(tab: string) {
  activeTab.value = tab;
  emit('update:modelValue', tab);
  emit('change', tab);
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    activeTab.value = newVal;
  }
});
</script>

<style>
.tab-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px 0;
  position: relative;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #007aff;
  font-weight: bold;
}

.indicator {
  position: absolute;
  bottom: 0;
  height: 4px;
  background-color: #007aff;
  transition: left 0.3s, width 0.3s;
}
</style>
