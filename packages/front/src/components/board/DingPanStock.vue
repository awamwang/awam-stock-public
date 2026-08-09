<script setup lang="ts">
import { Ref } from 'vue'
import { IDingPanStock, IDepartmentTrade } from '@awamstock/model'
import { dingPan, longhus } from '@/apis/index'

const activeNames = ref(['0'])
const stock: Ref<Partial<IDingPanStock>> = ref({})
const longhuList: Ref<IDepartmentTrade[]> = ref([])

const route = useRoute()
const global = useGlobalStore()
const blockStore = useBlockStore()
const stockCode = computed(() => global.stockCode)

const { getYiDongsByTitle, getMarketMessagesByName, getRadarsByCode, getBeforeOpenStockByCode } = useDingPanStore()
const yiDongs = computed(() => getYiDongsByTitle(stock.value?.name))
const marketMessages = computed(() => getMarketMessagesByName(stock.value?.name))
const stockRadars = computed(() => getRadarsByCode(stock.value?.code))
const beforeOpenStock = computed(() => getBeforeOpenStockByCode(stock.value?.code))
const linkedLongTouBlocks = computed(() => blockStore.getLongTouBlocksByCode(stock.value?.code || stockCode.value))
const stockPoolsLength = computed(() => stock.value?.stock_pools && stock.value.stock_pools.length)

let reqId = 0

async function getData(code: string) {
  const id = ++reqId
  const [dingPanStock, longhuRes] = await Promise.all([dingPan({ code }), longhus({ code })])
  // 丢弃过期请求，避免快速切股时旧数据覆盖新名称/代码
  if (id !== reqId) return
  stock.value = dingPanStock || { code }
  longhuList.value = longhuRes.data || []
}

watch(
  stockCode,
  (code) => {
    if (!code) {
      stock.value = {}
      longhuList.value = []
      return
    }
    // 先写入新代码并清空旧名称，确保标题区立即响应
    stock.value = { code }
    getData(code)
  },
  { immediate: true }
)

watch(
  () => route.name,
  (name) => {
    if (name === 'ding-pan' && stockCode.value && !stock.value.name) {
      getData(stockCode.value)
    }
  }
)
</script>

<template>
  <div class="stock-basic">
    <StockBasicInfo :key="stockCode || stock.code || 'empty'" :stock="stock"></StockBasicInfo>

    <div class="blocks">
      <BlockTag :blocks="linkedLongTouBlocks" :showCode="false" :noLink="true"></BlockTag>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="竞价异动" name="1" v-if="beforeOpenStock.name">
        <BeforeOpenStockDetail :data="beforeOpenStock"></BeforeOpenStockDetail>
      </el-collapse-item>
      <el-collapse-item title="股票池" name="2" v-if="stockPoolsLength">
        <template #title> 股票池 {{ stockPoolsLength }}<el-icon class="header-icon"> </el-icon> </template>
        <StockPoolTable :data="stock.stock_pools" hiddenName />
      </el-collapse-item>
      <el-collapse-item title="异动" name="3" v-if="yiDongs && yiDongs.length">
        <template #title> 异动 {{ yiDongs.length }}<el-icon class="header-icon"> </el-icon> </template>
        <YidongTable :data="yiDongs" />
      </el-collapse-item>
      <el-collapse-item title="相关市场消息" name="4" v-if="marketMessages.length">
        <template #title> 相关市场消息 {{ marketMessages.length }}<el-icon class="header-icon"> </el-icon> </template>
        <MarketMessageTable :data="marketMessages" />
      </el-collapse-item>
      <el-collapse-item title="龙虎" name="5" v-if="longhuList.length">
        <LonghuTable :data="longhuList" hiddenName />
      </el-collapse-item>
      <el-collapse-item name="6" v-if="stockRadars.length">
        <template #title> 股票雷达 {{ stockRadars.length }}<el-icon class="header-icon"> </el-icon> </template>
        <RadarTable :data="stockRadars" hiddenName />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="scss">
.stock-basic {
  .blocks {
    margin: 10px 0;
  }

  .el-collapse {
    .el-collapse-item__header {
      font-weight: bold;
    }

    .el-collapse-item__content {
      padding-bottom: 0;
    }

    .mood-blocks {
      max-width: 100px;
    }
  }
}
</style>
