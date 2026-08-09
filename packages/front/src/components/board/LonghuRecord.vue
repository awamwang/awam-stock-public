<template>
  <div>{{ text }}</div>
  <h2 :key="stockCode">code {{ stockCode }}</h2>
  <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>
  <el-table :data="list">
    <el-table-column prop="symbol" label="代码" width="180" />
    <el-table-column prop="name" label="名称" width="180" />
    <el-table-column prop="department" label="营业部" />
    <el-table-column prop="net" label="净额" />
    <el-table-column prop="date" label="交易日期" />
  </el-table>
</template>

<script setup lang="ts">
import { IDepartmentTrade } from '@awamstock/model'
import { longhus } from '@/apis/flow'

const text = '龙虎历史'
const global = useGlobalStore()
const stockCode = computed(() => global.stockCode)
const list = ref<IDepartmentTrade[]>([])

let reqId = 0

async function load(code: string) {
  const id = ++reqId
  const res = await longhus({ code })
  if (id !== reqId) return
  list.value = res.data || []
}

watch(
  stockCode,
  (code) => {
    if (!code) {
      list.value = []
      return
    }
    load(code)
  },
  { immediate: true }
)
</script>
