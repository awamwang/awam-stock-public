<template>
  <div>{{ text }}</div>
  <h2>code {{ global.stockCode }}</h2>
  <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>
  <el-table :data="list">
    <el-table-column prop="symbol" label="代码" width="180" />
    <el-table-column prop="name" label="名称" width="180" />
    <el-table-column prop="department" label="营业部" />
    <el-table-column prop="net" label="净额" />
    <el-table-column prop="date" label="交易日期" />
  </el-table>
</template>

<script lang="ts">
import { IDepartmentTrade } from '@awamstock/model'
import { longhus } from '@/apis/flow'

export default {
  data() {
    return {
      text: '龙虎历史',
      global: useGlobalStore(),
      list: [] as IDepartmentTrade[],
    }
  },
  watch: {
    'global.stockCode': {
      // immediate: true,
      async handler(code: string) {
        this.list = await longhus({ code })
      },
    },
  },
}
</script>
