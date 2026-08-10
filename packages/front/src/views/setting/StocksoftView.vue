<script setup lang="ts">
import { ElTable } from 'element-plus'

import { IStocksoftWindow, showToolWindow, list } from '@/apis/stocksoft'
import useThsLinker from '@/composables/useThsLinker'
import type { LinkMode } from '@/composables/thsLinkerClient'

const route = useRoute()
const softTableRef = ref<InstanceType<typeof ElTable>>()
const global = useGlobalStore()
const thsLinker = useThsLinker()
const linkSoftIp = ref(global.linkSoftIp)
const thsLinkerWsUrl = ref(global.thsLinkerWsUrl)
const sendStockCode = ref('')
const linkMode = computed({
  get: () => global.linkMode,
  set: (mode: LinkMode) => global.setLinkMode(mode),
})
const stocksoftList = computed(() => global.stocksofts)
const isThsLinker = computed(() => global.linkMode === 'thsLinker')
const thsConnectedText = computed(() => (thsLinker.connected.value ? '已连接' : '未连接'))

async function saveLinkSoftIp() {
  global.setLinkSoftIp(linkSoftIp.value)
}

async function saveThsLinkerWsUrl() {
  global.setThsLinkerWsUrl(thsLinkerWsUrl.value)
}

async function sendStockCodeByThsLink() {
  const code = sendStockCode.value.trim()
  if (!code) {
    useNotify().notify('请输入股票代码', { type: 'warning' })
    return
  }
  if (!thsLinker.connected.value) {
    useNotify().notify('THS Link 未连接', { type: 'warning' })
    return
  }
  await global.emitStockCodeToOneLinked(code)
  useNotify().notify(`已发送代码 ${code}`, {
    title: 'Success',
    type: 'success',
    duration: 1,
  })
}

async function showLinkingToolWindow() {
  let res = await showToolWindow()

  useNotify().notify(res, {
    title: 'Success',
    type: 'success',
  })
}

async function getStocksofts() {
  if (isThsLinker.value) {
    thsLinker.list()
    return
  }
  global.setStocksofts(await list())
}

const onSelectionChange = (val: IStocksoftWindow[]) => {
  global.setLinkedStocksofts(val)
}

function isSameSoft(a: IStocksoftWindow, b: IStocksoftWindow) {
  if (a.id || b.id) {
    return a.id === b.id
  }
  return a.hwnd === b.hwnd
}

async function toggleLinkedSelection() {
  await nextTick()

  if (global.linkedStocksofts) {
    const selectedRows = stocksoftList.value.filter((soft) => global.linkedStocksofts.some((linked) => isSameSoft(soft, linked)))

    if (selectedRows?.length) {
      selectedRows.forEach((row) => {
        softTableRef.value?.toggleRowSelection(row, true)
      })
    }
  }
}

watch(linkMode, async (mode) => {
  thsLinker.syncByMode()
  if (mode === 'stocksoftLink') {
    await getStocksofts()
  } else {
    thsLinker.list()
  }
})

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
    <el-space alignment="center" style="margin: 10px" wrap>
      <span>联动方式</span>
      <el-radio-group v-model="linkMode">
        <el-radio-button value="stocksoftLink">联动软件</el-radio-button>
        <el-radio-button value="thsLinker">ths-linker</el-radio-button>
      </el-radio-group>
    </el-space>

    <el-space v-if="!isThsLinker" alignment="flex-start" style="margin: 10px" wrap>
      <el-input v-model="linkSoftIp" placeholder="请填写联动软件的ip" size="default" clearable></el-input>
      <el-button type="primary" @click="saveLinkSoftIp">设置ip</el-button>

      <el-button type="primary" @click="showLinkingToolWindow">显示窗口</el-button>
      <el-button type="primary" @click="getStocksofts">刷新股软</el-button>
    </el-space>

    <el-space v-else alignment="flex-start" style="margin: 10px" wrap>
      <el-input v-model="thsLinkerWsUrl" placeholder="ws://127.0.0.1:8765" size="default" clearable style="width: 280px"></el-input>
      <el-button type="primary" @click="saveThsLinkerWsUrl">保存地址</el-button>
      <el-button type="primary" @click="getStocksofts">刷新实例</el-button>
      <el-input v-model="sendStockCode" placeholder="股票代码，回车发送到实例" size="default" clearable style="width: 220px" @keyup.enter="sendStockCodeByThsLink" />
      <span>连接状态：{{ thsConnectedText }}</span>
    </el-space>

    <el-table :data="stocksoftList" border stripe @selection-change="onSelectionChange" ref="softTableRef">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" key="name" label="名称" :min-width="200" />
      <el-table-column v-if="isThsLinker" prop="id" key="id" label="pid" :min-width="100" />
      <el-table-column v-if="isThsLinker" prop="code" key="code" label="当前代码" :min-width="100" />
      <el-table-column v-if="isThsLinker" prop="ths_dir" key="ths_dir" label="安装目录" :min-width="240" />
    </el-table>
  </div>
</template>
