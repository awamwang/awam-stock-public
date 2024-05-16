<script setup lang="ts">
import { IBlock } from '@awamstock/model'
import { Link } from '@element-plus/icons-vue'

const props = defineProps<{ block: IBlock | null; showCode?: boolean; noLink?: boolean }>()
const { block, showCode, noLink } = toRefs(props)
const attrs = useAttrs()

async function setLinkedStocksoftCode(code?: string) {
  if (!code) return

  console.log('block', code)
  useGlobalStore().emitStockCodeToOneLinked(code)
}
</script>

<template>
  <template v-if="block">
    <el-link class="block-text" v-if="!noLink" @click="setLinkedStocksoftCode(block?.code)">
      <span v-bind="attrs">
        {{ block.name }}
        <span v-if="showCode">({{ block.code }})</span>
        <el-icon><Link /></el-icon>
        <slot />
      </span>
    </el-link>
    <span v-bind="attrs" class="block-text" v-else>
      {{ block.name }}
      <span v-if="showCode">({{ block.code }})</span>
      <slot />
    </span>
  </template>
</template>

<style lang="scss">
.block-text {
  font-size: smaller;
}
</style>
