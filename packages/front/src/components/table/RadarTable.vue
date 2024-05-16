<script setup lang="ts">
import { IRadar, IBlock } from '@awamstock/model'
import { formatRowTime } from '@/utils/element/index'

const props = withDefaults(
  defineProps<{
    data?: IRadar[]
    block?: IBlock
    hiddenName?: boolean
    limit?: number
  }>(),
  {
    limit: 5,
  }
)
const { data, block, hiddenName, limit } = toRefs(props)
const strNameMap = computed(() => useGlobalStore().strNameMap.radar || {})

const radars = computed(() => {
  if (data?.value) return data?.value

  if (block?.value) return _.uniqBy(useDingPanStore().getRadarsByBlock(block.value), 'code')

  return []
})
</script>

<template>
  <PaginationTable :data="radars" :page-size="limit">
    <el-table-column prop="name" :label="strNameMap.name" min-width="100" fixed v-if="!hiddenName">
      <template v-slot="scope"><StockText :stock="scope.row" /></template>
    </el-table-column>
    <el-table-column prop="type" :label="strNameMap.type" min-width="80" sortable />
    <el-table-column prop="content" :label="strNameMap.content" min-width="200" />
    <el-table-column prop="lb" :label="strNameMap.lb" min-width="80" sortable />
    <el-table-column prop="time" :label="strNameMap.time" min-width="100" :formatter="formatRowTime" sortable />
  </PaginationTable>
</template>
