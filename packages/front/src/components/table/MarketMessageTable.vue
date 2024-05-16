<script setup lang="ts">
import { IMarketMessage } from '@awamstock/model'
import { marketMessageBlocks, formatRowTime } from '@/utils/element/index'

const props = defineProps<{
  data?: IMarketMessage[]
}>()

const strNameMap = computed(() => useGlobalStore().strNameMap.marketMessage || {})
</script>

<template>
  <PaginationTable :data="props.data" :page-size="10" max-height="500" show-overflow-tooltip>
    <el-table-column type="expand">
      <template #default="scope">
        <span v-if="scope.row.summary.length > 30">{{ scope.row.summary }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="title" :label="strNameMap.title" min-width="200" />
    <!-- <el-table-column prop="summary" :label="strNameMap.summary">
      <template #default="scope"> {{ scope.row.summary?.slice(0, 30) }} </template>
    </el-table-column> -->
    <el-table-column prop="block" :label="strNameMap.blocks" min-width="100">
      <template #default="scope">
        {{ marketMessageBlocks(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column prop="time" :label="strNameMap.time" :formatter="formatRowTime" min-width="60" sortable />
  </PaginationTable>
</template>
