<script setup lang="ts">
import { IBlock, IStockPool } from '@awamstock/model'
import { formatPercentage, formatStockPoolRowTime, stockPoolBlocks, formatRowStockPoolTypeMap, stockPoolReason } from '@/utils/element/index'

const props = defineProps<{
  data?: IStockPool[]
  block?: IBlock
  hiddenName?: boolean
  tiny?: boolean
}>()
const { data, hiddenName, tiny } = toRefs(props)
const attrs = useAttrs()

const strNameMap = computed(() => useGlobalStore().strNameMap.stockPool || {})
</script>

<template>
  <el-table size="small" :data="data" v-bind="attrs" v-if="data">
    <el-table-column prop="name" :label="strNameMap.name" min-width="100" fixed v-if="!hiddenName">
      <template v-slot="scope"><StockText :stock="scope.row" /></template>
    </el-table-column>
    <el-table-column prop="type" :label="strNameMap.type" :formatter="formatRowStockPoolTypeMap" sortable v-if="!tiny" />
    <el-table-column :label="strNameMap.first_limit_up" prop="first_limit_up" :formatter="formatStockPoolRowTime" sortable />
    <el-table-column :label="strNameMap.last_limit_up" prop="last_limit_up" :formatter="formatStockPoolRowTime" sortable v-if="!tiny" />
    <!-- 开板次数，连板情况，炸板时间 -->
    <el-table-column prop="turnover_ratio" :label="strNameMap.turnover_ratio" :formatter="(a, b, v) => formatPercentage(a, b, v * 100)" sortable v-if="!tiny" />
    <el-table-column label="关联板块">
      <template #default="scope">
        <el-tooltip placement="top" :content="stockPoolReason(scope.row)" :disabled="!stockPoolReason(scope.row)" :enterable="false">
          {{ stockPoolBlocks(scope.row) }}
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
