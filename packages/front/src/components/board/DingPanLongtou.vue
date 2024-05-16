<script setup lang="ts">
import { IStockPool } from '@awamstock/model'
import useLbStockPool from '@/composables/data/useLbStockPool'

const { lbData } = useLbStockPool()
const blockStore = useBlockStore()
const dingPanStore = useDingPanStore()

function getBlockStocks(stocks: IStockPool[]) {
  return dingPanStore.moodBlocks
    .map((block) => ({
      name: block.name,
      stocks: blockStore.filterStocksByBlock(stocks, block),
    }))
    .filter(({ stocks }) => stocks.length)
}

function getPromotionRate(lb: number) {
  const yesterdayLb = lb === -1 ? lb : lb - 1

  const len = lbData.find((item) => item.lb === lb)?.stocks?.length || 0
  const yesterdayLen = lbData.find((item) => item.lb === yesterdayLb)?.yesterdayStocks?.length || 0

  return yesterdayLen ? ((len * 100) / yesterdayLen).toFixed(0) : '-'
}
</script>

<template>
  <LbCard></LbCard>

  <el-table size="small" :data="lbData" border>
    <el-table-column label="" prop="name" min-width="60" />
    <el-table-column label="昨日数量" min-width="60">
      <template #default="scope">
        <p>{{ scope.row.yesterdayStocks.length }}只</p>
        {{
          getBlockStocks(scope.row.yesterdayStocks)
            .slice(0, 3)
            .map(({ name, stocks }) => `${name} ${stocks.length}`)
            .join(' ')
        }}
      </template>
    </el-table-column>
    <el-table-column label="昨日股票" min-width="200">
      <template #default="scope">
        <StockPoolTable :data="scope.row.yesterdayStocks" :max-height="300" :show-header="false" :border="false" tiny></StockPoolTable>
      </template>
    </el-table-column>
    <el-table-column label="今日数量" min-width="60">
      <template #default="scope">
        <p>{{ scope.row.stocks.length }}只</p>
        <p>晋级率 {{ getPromotionRate(scope.row.lb) }}%</p>
        {{
          getBlockStocks(scope.row.stocks)
            .slice(0, 3)
            .map(({ name, stocks }) => `${name} ${stocks.length}`)
            .join(' ')
        }}
      </template>
    </el-table-column>
    <el-table-column label="今日股票" min-width="200">
      <template #default="scope">
        <StockPoolTable :data="scope.row.stocks" :max-height="300" :show-header="false" :border="false" tiny></StockPoolTable>
      </template>
    </el-table-column>
  </el-table>
</template>
