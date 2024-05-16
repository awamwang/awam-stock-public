<script setup lang="ts">
import { $formatters } from '@/utils/vue/formatters'

const props = withDefaults(
  defineProps<{
    value: number
  }>(),
  {}
)
const attrs = useAttrs()

const type = computed(() => {
  if (props.value > 0) {
    if (props.value > 7) {
      return 'purple'
    }

    return 'red'
  } else {
    return 'green'
  }
})
</script>

<template>
  <HighlightStyle :value="props.value" :type="type" v-bind="attrs">
    {{ $formatters.toFixed(props.value) }}%
    <slot></slot>
  </HighlightStyle>
</template>
