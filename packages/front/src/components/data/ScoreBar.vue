<script setup lang="ts">
const props = withDefaults(defineProps<{ percentage: number; desc: string }>(), {
  percentage: 0,
})
const { percentage, desc } = toRefs(props)
const attrs = useAttrs()

const color = computed(() => {
  if (percentage.value >= 80) {
    return 'var(--el-color-success)'
  } else if (percentage.value >= 60) {
    return 'var(--el-color-warning)'
  } else {
    return 'var(--el-color-danger)'
  }
})
const format = (p: number) => (p === 100 ? '满分' : `${desc.value}: ${p}`)
</script>

<template>
  <el-progress :percentage="percentage" :color="color" :format="format" v-bind="attrs" />
</template>
