<script setup lang="ts">
import { IBlock } from '@awamstock/model'

const props = defineProps<{
  blocks: IBlock[]
  showCode?: boolean
  noLink?: boolean
}>()
const { blocks, showCode, noLink } = toRefs(props)
const drawerShow = ref(false)
const currBlock = ref<IBlock>()

const blockStore = useBlockStore()
const dingPanStore = useDingPanStore()
const blockDayIndexMap = computed(() => blockStore.blockDayIndexMap || {})
const moodBlockIndexMap = computed(() => dingPanStore.moodBlockIndexMap || {})

function notShow(block: IBlock) {
  return block.tags?.includes('hidden') || block.type === 'zs'
}
const myBlocks = computed(() => {
  return blocks.value.filter((block) => !notShow(block)).sort((a, b) => blockStore.getZt(b) - blockStore.getZt(a))
})

function toggleDrawer() {
  drawerShow.value = !drawerShow.value
}

const emit = defineEmits<{
  (e: 'change', code: string): void
}>()

const onBlockClick = (block: IBlock) => {
  currBlock.value = block
  toggleDrawer()
  emit('change', block.code)
}
</script>

<template>
  <el-space wrap>
    <el-tag :key="block.code" :type="moodBlockIndexMap[block.code]?.rs > 0.5 ? 'danger' : 'info'" v-for="block in myBlocks" @click="onBlockClick(block)">
      <BlockText :block="block" :showCode="showCode" :noLink="noLink" />
      {{ blockDayIndexMap[block.code] ? `${blockStore.getZt(block)}/${block.codeList?.length || 1}` : '' }}
      {{ moodBlockIndexMap[block.code] ? moodBlockIndexMap[block.code].r + '%' : '' }}
    </el-tag>
  </el-space>

  <el-drawer v-model="drawerShow" :title="currBlock.name" direction="rtl" size="50%" v-if="currBlock">
    <BlockDetail :block="currBlock" />
  </el-drawer>
</template>
