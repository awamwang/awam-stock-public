<script setup lang="ts">
import { Chart } from 'hqchart'

const lineOption = {
  Type: '历史K线图',
  Symbol: '000001.sh',

  //窗口指标
  Windows: [
    { Index: 'MA', Modify: false, Change: false },
    { Index: 'VOL', Modify: false, Change: false },
  ],

  IsShowCorssCursorInfo: true,

  //边框
  Border: {
    Left: 1,
    Right: 1, //右边间距
    Top: 25,
    Bottom: 25,
  },

  KLine: {
    Right: 1, //复权 0 不复权 1 前复权 2 后复权
    Period: 0, //周期: 0 日线 1 周线 2 月线 3 年线
    PageSize: 70,
    IsShowTooltip: true,
  },
}

const jsChart = ref<any>()
const klineRef = ref()

//创建K线图
const createKLine = () => {
  if (jsChart.value) return

  jsChart.value = Chart.JSChart.Init(klineRef.value)
  jsChart.value!.SetOption(lineOption)
}

const onSize = () => {
  var chartHeight = window.innerHeight - 125
  var chartWidth = window.innerWidth - 50

  if (klineRef.value) {
    klineRef.value.style.width = chartWidth + 'px'
    klineRef.value.style.height = chartHeight + 'px'
    if (jsChart.value) jsChart.value!.OnSize()
  }
}

onMounted(() => {
  onSize()

  window.onresize = () => {
    onSize()
  }

  createKLine()
})
</script>

<template>
  <div id="mood-index" ref="klineRef"></div>
</template>
