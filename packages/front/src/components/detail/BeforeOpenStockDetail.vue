<script setup lang="ts">
import { $formatters } from '@/utils/vue/formatters'
import { IBeforeOpenStock } from '@awamstock/model'

const props = defineProps<{
  data?: Partial<IBeforeOpenStock>
}>()

const { data } = toRefs(props)
const strNameMap = computed(() => useGlobalStore().strNameMap.beforeOpenStock || {})
</script>

<template>
  <el-descriptions size="small" :column="4">
    <template v-if="data">
      <el-descriptions-item :label="strNameMap.gn" min-width="100">{{ data.gn }}</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.money_type" min-width="100">{{ data.money_type }}</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.hs" min-width="100">{{ data.hs }}%</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.lt" min-width="100">{{ $formatters.numberToCn(data.lt) }}</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.lb" min-width="100">{{ data.lb }}</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.r" min-width="100">{{ $formatters.toFixed(data.r) }}%</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.m_net" min-width="100">{{ $formatters.numberToCn(data.m_net) }}</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.r_max" min-width="100">{{ data.r_max }}%</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.zt_to_buy" min-width="100">{{ $formatters.numberToCn(data.zt_to_buy) }}</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.block_names" min-width="100">{{ data.block_names }}</el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<style lang="scss">
.el-descriptions {
  .el-descriptions__header {
    margin-bottom: 4px;
  }

  .el-descriptions__body {
    .el-descriptions__table {
      .el-descriptions__cell {
        line-height: normal;
        padding-bottom: 4px;
      }
    }
  }
}
</style>
