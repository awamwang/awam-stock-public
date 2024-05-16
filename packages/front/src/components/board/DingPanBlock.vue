<script setup lang="ts">
const currentBlock = ref()
const moodBlockStockTableRef = ref()

watch(currentBlock, () => moodBlockStockTableRef.value?.resetPage())
</script>

<template>
  高标情况、龙头涨幅、异动
  <MoodBlockTable @current-change="(block) => (currentBlock = block)"></MoodBlockTable>
  <p></p>
  <MoodBlockStockTable :block="currentBlock" persistentKey="dingPanBlock_moodBlockStock" ref="moodBlockStockTableRef"></MoodBlockStockTable>
</template>
