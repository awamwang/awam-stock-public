<script setup lang="ts">
const data = computed(() => useDingPanStore().beforeOpenStockGroup)
const strNameMap = computed(() => useGlobalStore().strNameMap.beforeOpenStock || {})

const currentRow = ref()

const emit = defineEmits<{
  (e: 'gn-change', gn: string): void
}>()

watch(currentRow, (val) => {
  if (val) {
    emit('gn-change', val.gn)
  }
})
</script>

<template>
  <el-table size="small" row-key="gn" highlight-current-row @current-change="(val) => (currentRow = val)" :data="data" v-if="data">
    <el-table-column prop="gn" :label="strNameMap.gn" width="100" />
    <el-table-column prop="count" label="计数" width="40" />
  </el-table>
</template>
