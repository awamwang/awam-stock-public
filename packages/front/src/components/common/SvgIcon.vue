<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    className?: string
    icon: string
    prefix?: string
    color?: string
    size?: string
  }>(),
  {
    className: '',
    icon: '',
    prefix: 'icon-',
    color: 'var(--el-color-info)',
    size: '20px',
  }
)
const attrs = useAttrs()

const classList = computed(() => {
  return ['icon', props.className]
})
const iconName = computed(() => {
  return `#${props.prefix}${props.icon}`
})
</script>

<template>
  <el-icon v-bind="attrs">
    <svg :class="classList" aria-hidden="true">
      <use :xlink:href="iconName" :fill="color" />
    </svg>
  </el-icon>
</template>

<style>
.icon {
  /* stylelint-disable-next-line value-keyword-case */
  fill: currentColor;
  overflow: hidden;
}
</style>
