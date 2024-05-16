<script setup lang="ts">
import { IDepartmentTrade } from '@awamstock/model'
import { $formatters } from '@/utils/vue/formatters'

const props = defineProps<{
  data?: IDepartmentTrade[]
}>()
const { data } = toRefs(props)
</script>

<template>
  <PaginationTable :data="data">
    <!-- <el-table-column prop="name" label="名称" min-width="60" /> -->
    <el-table-column prop="date" label="日期" min-width="100" sortable />
    <el-table-column prop="buy_rate" label="买入占比" min-width="100" sortable>
      <template #default="scope"> {{ $formatters.toFixed(scope.row.buy_rate) }}% </template>
    </el-table-column>
    <el-table-column prop="department" label="营业部" min-width="200" sortable>
      <template #default="scope">
        <DepartmentText :name="scope.row.department"></DepartmentText>
      </template>
    </el-table-column>
    <el-table-column prop="net" label="净流入" min-width="120" sortable>
      <template #default="scope">
        {{ $formatters.numberToCn(scope.row.net) }}
      </template>
    </el-table-column>
  </PaginationTable>
</template>
