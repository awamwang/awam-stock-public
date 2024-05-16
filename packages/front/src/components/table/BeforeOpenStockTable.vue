<script setup lang="ts">
import { $formatters } from '@/utils/vue/formatters'

const props = defineProps<{ block?: string; gn?: string }>()
const { gn: gnFilter } = toRefs(props)

const data = computed(() =>
  useDingPanStore().beforeOpenStocks.filter(({ gn }) => {
    if (gnFilter?.value) {
      return gn === gnFilter.value
    }
    return true
  })
)
const strNameMap = computed(() => useGlobalStore().strNameMap.beforeOpenStock || {})
</script>

<template>
  <el-table size="small" :data="data" row-key="code" :default-sort="{ prop: 'lb', order: 'descending' }" v-if="data">
    <el-table-column :label="strNameMap.name" prop="name">
      <template v-slot="scope"><StockText :stock="scope.row" /></template>
    </el-table-column>
    <HighlightTableColumn :label="strNameMap.zt_to_buy" prop="zt_to_buy" :formatter="(v) => `${$formatters.numberToCn(v)}`" :biggerThan="500 * 10000" min-width="80" sortable />
    <HighlightTableColumn :label="strNameMap.r" prop="r" :formatter="(v) => `${$formatters.toFixed(v)}%`" highlightRatio min-width="80" sortable />
    <HighlightTableColumn :label="strNameMap.m_net" prop="m_net" :formatter="(v) => `${$formatters.numberToCn(v)}`" :biggerThan="100 * 10000" min-width="80" sortable />
    <el-table-column :label="strNameMap.money_type" prop="money_type" min-width="60" />
    <HighlightTableColumn :label="strNameMap.lb" prop="lb" :biggerThan="1" min-width="60" sortable />
    <HighlightTableColumn :label="strNameMap.hs" prop="hs" :formatter="(v) => `${$formatters.toFixed(v)}%`" :biggerThan="1" min-width="60" sortable />
    <HighlightTableColumn :label="strNameMap.lt" prop="lt" :formatter="(v) => `${$formatters.numberToCn(v)}`" :biggerThan="300 * 10000 * 10000" min-width="80" sortable />
    <el-table-column :label="strNameMap.block_names" prop="block_names" min-width="160" />
  </el-table>
</template>
