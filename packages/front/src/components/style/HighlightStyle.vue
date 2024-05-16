<script setup lang="ts">
import { HighlightValue, HighlightType } from './highlightType'

const props = withDefaults(
  defineProps<{
    isHighlight?: boolean | ((v?: HighlightValue) => boolean)
    type?: HighlightType
    value?: HighlightValue
  }>(),
  {
    isHighlight: true,
    type: 'red',
  }
)
const attrs = useAttrs()
const highlight = computed(() => {
  const func = props.isHighlight

  if (_.isFunction(func)) {
    return func(props.value)
  }

  return Boolean(func)
})

const classNames = computed(() => (highlight.value ? ['highlightable', `highlight--${props.type}`] : 'highlightable'))
</script>

<template>
  <span v-bind="attrs" :class="classNames">
    <slot>{{ String(props.value) }}</slot>
  </span>
</template>

<style lang="scss">
// .highlightable {
// }
.highlight--red {
  color: var(--el-color-danger);
}

.highlight--green {
  color: var(--el-color-success);
}

.highlight--purple {
  color: var(--el-color-purple);
}

.highlight--search-result {
  color: var(--el-color-info);
}

.highlight--hint {
  color: var(--el-color-success);
}
</style>
