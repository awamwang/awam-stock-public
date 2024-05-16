<script setup lang="ts">
const currentGn = ref()
</script>

<template>
  <el-row>
    <el-col :span="4">
      <el-card class="box-card" :body-style="{ padding: '0' }">
        <BeforeOpenStockGroupTable @gn-change="(v) => (currentGn = v)"></BeforeOpenStockGroupTable>
      </el-card>
    </el-col>
    <el-col :span="20">
      <el-card class="box-card" :body-style="{ padding: '0' }">
        <BeforeOpenStockTable :gn="currentGn"></BeforeOpenStockTable>
      </el-card>
    </el-col>
  </el-row>
</template>
