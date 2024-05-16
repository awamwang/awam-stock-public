<script setup lang="ts">
import { IBlock } from '@awamstock/model'

const props = defineProps<{
  block: IBlock
}>()

const { block } = toRefs(props)

const blockStore = useBlockStore()
const dingPanStore = useDingPanStore()

const strNameMap = computed(() => useGlobalStore().strNameMap.block || {})
const moodBlockStrNameMap = computed(() => useGlobalStore().strNameMap.moodBlock || {})
const blockDayStrNameMap = computed(() => useGlobalStore().strNameMap.blockDay || {})

const linkedMoodBlock = computed(() => dingPanStore.moodBlockIndexMap[block.value.code] || {})
const linkedBlockDay = computed(() => blockStore.blockDayIndexMap[block.value.code] || {})
</script>

<template>
  <el-descriptions size="small" :column="2">
    <template v-if="block">
      <el-descriptions-item :label="strNameMap.type" min-width="100">{{ block.type }}</el-descriptions-item>
      <el-descriptions-item :label="moodBlockStrNameMap.power" min-width="100">{{ linkedMoodBlock.power }}</el-descriptions-item>
      <el-descriptions-item :label="moodBlockStrNameMap.r" min-width="150">{{ linkedMoodBlock.r }}%</el-descriptions-item>
      <el-descriptions-item :label="moodBlockStrNameMap.rs" min-width="150">{{ linkedMoodBlock.rs }}%</el-descriptions-item>
      <el-descriptions-item :label="moodBlockStrNameMap.sort" min-width="100">{{ linkedMoodBlock.sort }}</el-descriptions-item>
      <el-descriptions-item :label="blockDayStrNameMap.zt" min-width="100">{{ linkedBlockDay.zt }}</el-descriptions-item>
      <el-descriptions-item :label="strNameMap.link" min-width="100"><BlockText :block="blockStore.getLinkedBlock(block, 'ths')">-ths</BlockText></el-descriptions-item>
    </template>
  </el-descriptions>

  <h3>相关个股</h3>
  <MoodBlockStockTable :block="block" :border="false" persistentKey="blockDetail_moodBlockStock" tiny />
  <h3>板块个股异动</h3>
  <RadarTable :block="block" :limit="10" />
</template>

<style lang="scss">
.el-descriptions {
  .el-descriptions__header {
    margin-bottom: 4px;
  }

  .el-descriptions__body {
    .el-descriptions__table {
      .el-descriptions__cell {
        line-height: normal;
        padding-bottom: 4px;
      }
    }
  }
}
</style>
