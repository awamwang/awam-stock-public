<script setup lang="ts">
import { PlainDataModel } from '@awamstock/shared/type'

import { HighlightValue, HighlightType } from '@C/style/highlightType'

const props = withDefaults(
  defineProps<{
    prop: string
    formatter?: (v: HighlightValue) => string
    isHighlight?: boolean | ((v: HighlightValue) => boolean)
    biggerThan?: number
    highlightRatio?: boolean | ((v: HighlightValue) => boolean)
    type?: 'search-result' | 'hint'
  }>(),
  {
    isHighlight: true,
  }
)
const attrs = useAttrs()

const getValue = computed(() => {
  const func = props.formatter

  if (_.isFunction(func)) {
    return (row: PlainDataModel) => func(row[props.prop])
  }
  return (row: PlainDataModel) => String(row[props.prop])
})

type HighlightTypeFunc = (row: PlainDataModel) => HighlightType
const getHighlightType = computed((): HighlightTypeFunc => {
  if (props.type) return () => props.type as HighlightType

  if (props.highlightRatio) {
    return (row: PlainDataModel) => {
      const value = Number(row[props.prop])

      if (value > 0) {
        if (value > 7) {
          return 'purple'
        }

        return 'red'
      } else {
        return 'green'
      }
    }
  } else {
    return () => 'red'
  }
})

const getHighlight = computed(() => {
  const func = props.isHighlight

  if (_.isFunction(func)) {
    return (row: PlainDataModel) => func(row[props.prop])
  }

  if (!_.isUndefined(props.biggerThan)) {
    return (row: PlainDataModel) => Number(row[props.prop]) > (props.biggerThan as number)
  }

  return () => Boolean(func)
})
</script>

<template>
  <el-table-column v-bind="attrs" :prop="props.prop">
    <template v-slot="scope">
      <HighlightStyle :value="getValue(scope.row)" :type="getHighlightType(scope.row)" :isHighlight="getHighlight(scope.row)"><slot></slot></HighlightStyle>
    </template>
  </el-table-column>
</template>
