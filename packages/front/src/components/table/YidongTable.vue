<script setup lang="ts">
import { IYiDong } from '@awamstock/model'
import { formatRowTime } from '@/utils/element/index'

const props = defineProps<{
  data?: IYiDong[]
}>()
const { data } = toRefs(props)

const strNameMap = computed(() => useGlobalStore().strNameMap.yiDong || {})
</script>

<template>
  <el-table size="small" :data="data" v-if="data">
    <el-table-column prop="title" :label="strNameMap.title" min-width="260" />
    <el-table-column :label="strNameMap.block" min-width="60" sortable>
      <template #default="scope">
        {{ scope.row.block && scope.row.block.Name }}
      </template>
    </el-table-column>
    <el-table-column prop="time" :label="strNameMap.time" :formatter="formatRowTime" min-width="60" sortable />
  </el-table>
</template>
