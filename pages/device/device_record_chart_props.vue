<template name="chart">
  <view class="charts-box">
    <qiun-data-charts 
      type="line"
      :opts="opts"
      :chartData="chartData"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

interface ChartData {
  categories: string[]
  series: {
    name: string
    data: number[]
  }[]
}

const props = defineProps<{
  chartData: ChartData
}>()

const opts = ref({
  color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
  padding: [15,10,0,15],
  enableScroll: false,
  legend: {},
  xAxis: {
    disableGrid: true
  },
  yAxis: {
    gridType: "dash",
    dashLength: 2
  },
  extra: {
    line: {
      type: "straight",
      width: 2,
      activeType: "hollow"
    }
  }
})
</script>

<style scoped>
  .charts-box {
    width: 100%;
    height: 300px;
  }
</style>
