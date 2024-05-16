<script setup lang="ts">
import { UNKNOWN } from '@awamstock/shared/global'
import { IStrNameMap, PlainDataModel } from '@awamstock/shared/type'

const props = defineProps<{
  name?: string
  strNameMap?: IStrNameMap<Record<string, unknown>>
  data1: PlainDataModel
  data2?: PlainDataModel
  k: string
  unit?: string
  reversed?: boolean
  compare?: (date1: string | number, date2: string | number) => boolean
  format?: (name: string | number) => string | number
}>()
const { name, k, strNameMap } = toRefs(props)
</script>

<template>
  <el-card class="two-data-card">
    <template #header>
      <div class="card-header">
        <span>{{ name || (strNameMap && strNameMap[k]) || UNKNOWN }}</span>
      </div>
    </template>
    <slot v-bind="props">
      <TwoDataProp v-bind="props" />
    </slot>
  </el-card>
</template>

<style lang="scss">
.two-data-card {
  .el-card__header {
    font-weight: bolder;
  }
}
</style>
