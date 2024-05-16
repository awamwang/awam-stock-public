<script setup lang="ts">
import { IBlock } from '@awamstock/model'
import { $formatters } from '@/utils/vue/formatters'

const blockStore = useBlockStore()
const dingPanStore = useDingPanStore()
const data = computed(
  () =>
    dingPanStore.moodBlocks.map((block) => ({
      ...block,
      ...blockStore.blockDayIndexMap[block.code],
    })) || []
)
const strNameMap = computed(() => useGlobalStore().strNameMap.moodBlock || {})

const emit = defineEmits<{
  (e: 'current-change', block: IBlock): void
}>()
</script>

<template>
  <el-table size="small" stripe :data="data.slice(0, 10)" highlight-current-row @current-change="(val) => emit('current-change', val)" row-key="code" v-if="data">
    <el-table-column prop="name" :label="strNameMap.name" min-width="140" fixed>
      <template v-slot="scope"><BlockText :block="scope.row" /></template>
    </el-table-column>
    <HighlightTableColumn :label="strNameMap.power" prop="power" :biggerThan="5000" min-width="80" sortable></HighlightTableColumn>
    <HighlightTableColumn :label="strNameMap.r" prop="r" :formatter="$formatters.toFixedPercent" :biggerThan="2" min-width="80" sortable></HighlightTableColumn>
    <HighlightTableColumn :label="strNameMap.m_net" prop="m_net" :formatter="$formatters.numberToCn" :biggerThan="2000 * 10000" min-width="80" sortable></HighlightTableColumn>
    <HighlightTableColumn :label="strNameMap.rs" prop="rs" :formatter="$formatters.toFixedPercent" :biggerThan="1" min-width="60" sortable></HighlightTableColumn>
    <HighlightTableColumn label="涨停" prop="zt" :biggerThan="5" min-width="60" sortable></HighlightTableColumn>
  </el-table>
</template>
