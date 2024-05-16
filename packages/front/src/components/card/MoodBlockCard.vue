<script lang="ts">
const iconTypes = ['first', 'second', 'third']
</script>

<script setup lang="ts">
import { IMoodBlockItem } from '@awamstock/model'
import { $formatters } from '@/utils/vue/formatters'

const props = withDefaults(
  defineProps<{
    data?: IMoodBlockItem
    list?: IMoodBlockItem[]
    index?: number
  }>(),
  {}
)
const attrs = useAttrs()

const moodBlock = computed(() => {
  if (props.data) {
    return props.data
  }
  if (props.list && props.index !== undefined) {
    return props.list[props.index]
  }
  return null
})
const icon = computed(() => (props.index !== undefined ? iconTypes[props.index] || '' : ''))
</script>

<template>
  <el-card v-bind="attrs" v-if="moodBlock">
    <div>{{ moodBlock.name }}<SvgIcon :icon="icon" /></div>
    <el-space>
      <HighlightStyle :value="moodBlock.power" :isHighlight="(v) => Number(v) > 5000"></HighlightStyle>
      <HighlightStyle :value="$formatters.toFixedPercent(moodBlock.rs)" :isHighlight="(v) => Number(v) > 1"></HighlightStyle>
    </el-space>
  </el-card>
</template>
