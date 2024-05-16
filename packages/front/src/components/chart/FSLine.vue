<script setup lang="ts">
import { View } from '@antv/g2'
import { Ref } from 'vue'

import { PlainDataModel } from '@awamstock/shared/type'
import { timer, dayjs, _ } from '@awamstock/shared/browser'
import useChart from '@/composables/chart/useG2Chart'

const props = withDefaults(defineProps<{ date?: Ref<string>; data: Ref<PlainDataModel[] | null>; position?: string | string[]; axis?: Record<string, any> }>(), {
  position: 'time*value',
  axis() {
    return {
      time: {},
      value: {},
    }
  },
})
const { date = ref(timer.today()), data, position, axis } = toRefs(props)

const attrs = useAttrs()
let am: View
let pm: View

const { uuid } = useChart({
  data,
  onInit(chart) {
    am = chart.createView({
      padding: [10, 0, 20, 30],
      region: {
        start: { x: 0, y: 0 },
        end: { x: 0.5, y: 1 },
      },
    })
    pm = chart.createView({
      padding: [10, 10, 20, 0],
      region: {
        start: { x: 0.5, y: 0 },
        end: { x: 1, y: 1 },
      },
    })

    const scaleOptions = _.defaultsDeep(attrs.scale, {
      time: {
        type: 'time',
        // nice: true,
        tickCount: 3,
        tickInterval: 1800 * 1000,
        min: dayjs(`${date.value} 09:30:00`).toDate().toString(),
        max: dayjs(`${date.value} 15:00:01`).toDate().toString(),
        formatter(val: any) {
          return dayjs(val).format('HH:mm')
        },
      },
    })

    am.scale(
      _.defaultsDeep(
        {
          time: {
            max: dayjs(`${date.value} 11:30:00`).toDate().toString(),
          },
        },
        scaleOptions
      )
    )
    pm.scale(
      _.defaultsDeep(
        {
          time: {
            min: dayjs(`${date.value} 13:00:00`).toDate().toString(),
          },
        },
        scaleOptions
      )
    )

    const axisTimeOptions = _.defaultsDeep(axis.value.time, {})
    const axisValueOptions = _.defaultsDeep(axis.value.value, {})

    am.axis('time', axisTimeOptions)
    am.axis('value', axisValueOptions)
    pm.axis('time', axisTimeOptions)
    pm.axis(
      'value',
      _.defaultsDeep(
        {
          label: null,
        },
        axisValueOptions
      )
    )
  },
  onRender(chart) {
    if (data.value) {
      const amData = data.value.filter((d) => dayjs(d.time).hour() < 12)
      const pmData = data.value.filter((d) => dayjs(d.time).hour() >= 12)

      am.data(amData)
      pm.data(pmData)
      am.line().position(position.value).shape('smooth')
      pm.line().position(position.value).shape('smooth')
    }
  },
})
</script>

<template>
  <div :id="uuid" class="chart" v-loading="!data" v-bind="attrs"></div>
</template>

<style>
.chart {
  width: 300px;
  height: 200px;
}
</style>
