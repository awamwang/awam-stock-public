<script setup lang="ts">
const data = computed(() => useDingPanStore().beforeOpenStockGroup)
const strNameMap = computed(() => useGlobalStore().strNameMap.beforeOpenStock || {})

const currentRow = ref()
</script>

<template>
  <el-table size="small" highlight-current-row @current-change="(val) => (currentRow = val)" :data="data" v-if="data">
    <el-table-column prop="gn" :label="strNameMap.gn" width="100" />
    <el-table-column prop="count" label="计数" width="40" />
  </el-table>
</template>
