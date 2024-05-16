<script setup lang="ts">
import { IDingPanStock } from '@awamstock/model'

const props = defineProps<{
  stock: Partial<IDingPanStock>
}>()
const { stock } = toRefs(props)

const activeNames = ref(['0'])

const global = useGlobalStore()

const { getMoodStockByCode, getMoodBlocksByCode } = useDingPanStore()
const moodStock = computed(() => getMoodStockByCode(stock.value?.code))
const moodStockChange = computed(() => moodStock.value && Number(moodStock.value?.change))
const moodBlocks = computed(() => getMoodBlocksByCode(stock.value?.code))
</script>

<template>
  <el-space wrap spacer="|" class="info">
    <div class="name">
      <el-link type="primary">{{ stock.name || '未获取' }}</el-link>
      <el-link>&nbsp;({{ global.stockCode }})</el-link>
      <el-link :href="`quicker:runaction:23235eb7-aba1-419c-9bbf-1aa4e0dbddc9?${stock.name} ${global.stockCode}`" type="danger">&nbsp;买</el-link>
      <el-link :href="`quicker:runaction:d351f59f-8fe5-4dda-ba42-969294756e83?${stock.name} ${global.stockCode}`" type="success">&nbsp;卖</el-link>
    </div>
    <el-tooltip placement="top" v-if="moodStock?.code">
      <!-- <template #content> 变化 {{ moodStock.change >= 0 ? `↑${moodStock.change}` : `↓${Math.abs(moodStock.change)}` }} </template> -->
      <el-badge :value="moodStock.sort">
        <el-tag
          >人气个股 <span>{{ moodStockChange >= 0 ? `↑${moodStock.change}` : `↓${Math.abs(moodStockChange)}` }}</span></el-tag
        >
      </el-badge>
    </el-tooltip>
    <el-tooltip placement="top" v-if="moodBlocks.length">
      <template #content>
        {{
          moodBlocks
            .map((b) => ({ sort: b.sort, name: b.name }))
            .map((b) => `${b.name}-${b.sort}`)
            .join(' ; ')
        }}
      </template>
      <el-badge :value="moodBlocks[0].sort" class="mood-blocks">
        <el-tag>热点板块 {{ moodBlocks[0].name }}</el-tag>
      </el-badge>
    </el-tooltip>
    <el-tooltip placement="top" v-if="stock.risky">
      <template #content> 点击查看营业部龙虎榜 </template>
      <el-tag type="danger" @click="activeNames.push('5')">龙虎危险</el-tag>
    </el-tooltip>

    <div style="width: 250px"><ScoreBar :percentage="stock.score" desc="安全分" :text-inside="true" :stroke-width="26" /></div>

    <div>换手率</div>
  </el-space>
</template>

<style lang="scss">
.info {
  .name {
    .el-link {
      font-size: medium;
      font-weight: bold;
    }
  }
}
</style>
