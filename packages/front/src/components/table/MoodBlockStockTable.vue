<script setup lang="ts">
import { IBlock } from '@awamstock/model'
import { $formatters } from '@/utils/vue/formatters'
import { formatRowTime } from '@/utils/element/index'
import useMoodBlockStock from '@/composables/data/useMoodBlockStock'

const props = withDefaults(
  defineProps<{
    block?: IBlock
    limit?: number
    tiny?: boolean
  }>(),
  {
    limit: 10,
  }
)
const tableRef = ref()

const stocks = computed(() => useMoodBlockStock().getSortedMoodBlockStocks(props.block))
const strNameMap = computed(() => useGlobalStore().strNameMap.moodBlockStock || {})
const stockPoolStrNameMap = computed(() => useGlobalStore().strNameMap.stockPool || {})

defineExpose({
  resetPage: () => tableRef.value?.resetPage(),
})
</script>

<template>
  <PersistentSortTable ref="tableRef" size="small" :data="stocks" :page-size="limit" row-key="code" v-if="stocks">
    <el-table-column :label="strNameMap.name" prop="name">
      <template v-slot="scope"><StockText :stock="scope.row" /></template>
    </el-table-column>
    <el-table-column :label="strNameMap.r" prop="r" min-width="60" sortable v-if="tiny">
      <template #default="scope">
        <span v-if="scope.row.limit_up_days">{{ $formatters.getNormalizeTimePartFromMillisecond(scope.row.first_limit_up) }} </span>
        <HighlightRatio :value="scope.row.r" v-else />
      </template>
    </el-table-column>
    <HighlightTableColumn :label="strNameMap.r" prop="r" :formatter="(v) => `${$formatters.toFixed(v)}%`" highlightRatio min-width="80" sortable v-else />
    <el-table-column :label="strNameMap.m" prop="m" min-width="60" :formatter="(a, b, v) => $formatters.numberToCn(v)" sortable />
    <HighlightTableColumn :label="strNameMap.m_net" prop="m_net" :formatter="$formatters.numberToCn" :biggerThan="2000 * 10000" min-width="80" sortable></HighlightTableColumn>
    <el-table-column :label="strNameMap.pos" prop="pos" min-width="60" sortable />
    <!-- <el-table-column :label="stockPoolStrNameMap.last_limit_up" prop="last_limit_up" :formatter="formatRowTime" sortable /> -->
    <el-table-column :label="stockPoolStrNameMap.first_limit_up" prop="first_limit_up" :formatter="formatRowTime" sortable v-if="!tiny" />
    <HighlightTableColumn :label="strNameMap.lb" prop="lb" :biggerThan="1" min-width="60" sortable />
    <HighlightTableColumn :label="strNameMap.hs" prop="hs" :formatter="$formatters.toFixedPercent" :biggerThan="10" min-width="60" sortable></HighlightTableColumn>
    <el-table-column :label="strNameMap.blocks" prop="blocks" min-width="160" />
  </PersistentSortTable>
</template>
