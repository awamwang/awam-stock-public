<script setup lang="ts">
import useChart from '@/composables/chart/useG2Chart'

import { PlainDataModel } from '@awamstock/shared/type'

const props = defineProps<{ data: PlainDataModel[]; position: string | string[] }>()
const { data } = toRefs(props)

const attrs = useAttrs()

const { uuid, init } = useChart({
  data,
  width: 500,
  height: 500,
  onInit(chart) {
    // chart.scale('sales', {
    //   nice: true,
    // })

    // chart.tooltip({
    //   showMarkers: false,
    // })
    // chart.interaction('active-region')

    chart.interval().position('year*sales')
  },
})

setTimeout(() => {
  data.value = [
    { year: '1951 年', sales: 38 },
    { year: '1952 年', sales: 52 },
    { year: '1956 年', sales: 61 },
    { year: '1957 年', sales: 145 },
    { year: '1958 年', sales: 48 },
    { year: '1959 年', sales: 38 },
    { year: '1960 年', sales: 38 },
    { year: '1962 年', sales: 38 },
  ]
  init()
}, 2000)
</script>

<template>
  <div :id="uuid" class="chart" v-loading="!data" v-bind="attrs"></div>
</template>

<style>
.chart {
  width: 100%;
  height: 400px;
}
</style>
