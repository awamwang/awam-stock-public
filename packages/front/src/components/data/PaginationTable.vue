<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { PlainDataModel } from '@awamstock/shared/type'

const props = withDefaults(
  defineProps<{
    data?: PlainDataModel[]
    pageSize?: number
  }>(),
  {
    pageSize: 10,
  }
)
const { data, pageSize } = toRefs(props)
const attrs = useAttrs()

const currentPage = ref(1)

function reset() {
  currentPage.value = 1
}

defineExpose({
  reset,
})
</script>

<template>
  <template v-if="data">
    <el-table size="small" v-bind="attrs" :data="data.slice((currentPage - 1) * pageSize, currentPage * pageSize)">
      <slot></slot>
    </el-table>
    <el-pagination small layout="prev, pager, next" v-bind="attrs" :page-size="pageSize" hide-on-single-page :total="data.length" v-model:currentPage="currentPage" />
  </template>
</template>
