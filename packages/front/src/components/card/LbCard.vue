<script setup lang="ts">
const stockPoolStore = useStockPoolStore()

const lbStockPools = computed(() => stockPoolStore.lbStockPools || {})
const yesterdayLbStockPools = computed(() => stockPoolStore.yesterdayLbStockPools || {})
</script>

<template>
  <el-card v-if="lbStockPools && yesterdayLbStockPools">
    <div>
      <span :key="k" v-for="k in Object.keys(lbStockPools)">{{ lbStockPools[k].length }} |</span>
    </div>
    <div>
      <span :key="k" v-for="k in Object.keys(yesterdayLbStockPools)">{{ yesterdayLbStockPools[k].length }} |</span>
    </div>
  </el-card>
</template>
