<script setup lang="ts">
import { IStock } from '@awamstock/model'
import { Link } from '@element-plus/icons-vue'

const props = defineProps<{ stock: IStock; showCode?: boolean; noLink?: boolean }>()
const { stock, showCode, noLink } = toRefs(props)
const attrs = useAttrs()

async function setLinkedStocksoftCode(code: string) {
  useGlobalStore().emitStockCodeToOneLinked(code)
}
</script>

<template>
  <el-link class="stock-text" v-if="!noLink" @click="setLinkedStocksoftCode(stock.code)">
    <span v-bind="attrs">
      {{ stock.name }}
      <span v-if="showCode">({{ stock.code }})</span>
      <el-icon><Link /></el-icon>
    </span>
  </el-link>
  <span v-bind="attrs" class="stock-text" v-else>
    {{ stock.name }}
    <span v-if="showCode">({{ stock.code }})</span>
  </span>
</template>

<style lang="scss">
.stock-text {
  font-size: smaller;
}
</style>
