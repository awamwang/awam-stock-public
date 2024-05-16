<script setup lang="ts">
import { ElTable } from 'element-plus'

import { IStocksoftWindow, showToolWindow, list } from '@/apis/stocksoft'

const route = useRoute()
const softTableRef = ref<InstanceType<typeof ElTable>>()
const global = useGlobalStore()
const linkSoftIp = ref(global.linkSoftIp)
const stocksoftList = computed(() => global.stocksofts)

async function saveLinkSoftIp() {
  global.setLinkSoftIp(linkSoftIp.value)
}

async function showLinkingToolWindow() {
  let res = await showToolWindow()

  useNotify().notify(res, {
    title: 'Success',
    type: 'success',
  })
}

async function getStocksofts() {
  global.setStocksofts(await list())
}

const onSelectionChange = (val: IStocksoftWindow[]) => {
  global.setLinkedStocksofts(val)
}

async function toggleLinkedSelection() {
  await nextTick()

  if (global.linkedStocksofts) {
    const linkedHwnds = global.linkedStocksofts.map((soft) => soft.hwnd)
    const selectedRows = stocksoftList.value.filter((soft) => linkedHwnds.includes(soft.hwnd))

    if (selectedRows?.length) {
      selectedRows.forEach((row) => {
        softTableRef.value?.toggleRowSelection(row, true)
      })
    }
  }
}

// watch(global.linkedStocksofts, toggleLinkedSelection)
watch(stocksoftList, toggleLinkedSelection)
watch(
  () => route.name,
  (name) => {
    if (name === 'setting/stocksoft') {
      toggleLinkedSelection()
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="stocksoft">
    <el-space alignment="flex-start" style="margin: 10px">
      <el-input v-model="linkSoftIp" placeholder="请填写联动软件的ip" size="default" clearable></el-input>
      <el-button type="primary" @click="saveLinkSoftIp">设置ip</el-button>

      <el-button type="primary" @click="showLinkingToolWindow">显示窗口</el-button>
      <el-button type="primary" @click="getStocksofts">刷新股软</el-button>
    </el-space>

    <el-table :data="stocksoftList" border stripe @selection-change="onSelectionChange" ref="softTableRef">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" key="hw" label="名称" :minwidth="200"> </el-table-column>
    </el-table>
  </div>
</template>
