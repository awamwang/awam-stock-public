<script lang="ts">
import { colorRed, colorGreen } from '@/styles/ts/index'
import { PlainDataModel } from '@awamstock/shared/type'

export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data1: PlainDataModel
    data2: PlainDataModel
    k: string
    unit?: string
    reversed?: boolean
    compare?: (date1: string | number, date2: string | number) => boolean
    format: (v: string | number) => string | number
  }>(),
  {
    data2: () => ({}),
    unit: () => '',
    reversed: () => false,
    format: (v: string | number) => v,
  }
)
const { data1, data2, k, reversed, compare } = toRefs(props)
const diff = computed(() => data1.value !== data2.value)
const style = computed(() => {
  if (!diff.value || !data1.value || data1.value[k.value] === undefined) {
    return {}
  }
  const v1 = data1.value[k.value]
  const v2 = data2.value && data2.value[k.value]

  if (compare?.value) {
    return compare?.value(v1, v2) ? colorRed : colorGreen
  } else {
    const bigger = reversed.value ? v2 > v1 : v1 > v2
    return bigger ? colorRed : colorGreen
  }
})
</script>

<template>
  <span :style="style">{{ format(data1[k]) }}{{ unit }}</span>
  <span v-if="data2[k] && diff">/{{ format(data2[k]) }}{{ unit }}</span>
</template>
