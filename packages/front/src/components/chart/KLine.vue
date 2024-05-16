<script setup lang="ts">
import { Ref } from 'vue'
import useChart from '@/composables/chart/useG2Chart'

import { PlainDataModel } from '@awamstock/shared/type'

const props = withDefaults(defineProps<{ data: Ref<PlainDataModel[] | null>; position?: string | string[] }>(), {
  position: 'time*value',
})
const { data, position } = toRefs(props)

const attrs = useAttrs()

const { uuid } = useChart({
  data,
  // width: 500,
  // height: 500,
  onInit(chart) {
    // chart.scale('value', {
    //   nice: true,
    // })
    chart.scale({
      time: {
        tickCount: 5,
        nice: true,
        // min: '9:30',
        // max: '15:00',
      },
    })

    // chart.tooltip({
    //   showMarkers: false,
    // })
    // chart.interaction('active-region')

    chart.line().position(position.value)
  },
})
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
