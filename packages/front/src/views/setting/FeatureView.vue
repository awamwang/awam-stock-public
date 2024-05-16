<script setup lang="ts">
import { ElTable } from 'element-plus'

import { IStocksoftWindow, showToolWindow, list } from '@/apis/stocksoft'
import { useFeatureStore } from '@/stores/feature'

const route = useRoute()
const feature = useFeatureStore()
const baoerEnabled = ref(feature.baoer.enable)

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
  <div class="feature-setting">
    <el-space alignment="flex-start" style="margin: 10px">
      <!-- 放到折叠面板中 -->
      <el-collapse>
        <el-collapse-item title="选股宝">
          <el-form label-width="120px">
            <el-form-item label="开关">
              <el-switch v-model="baoerEnabled"></el-switch>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <!-- <el-row>
        <el-col :span="12"> </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="showLinkingToolWindow">显示股软连接工具</el-button>
        </el-col>
      </el-row> -->
    </el-space>
    <!-- <el-button type="primary" @click="saveLinkSoftIp">保存</el-button> -->
  </div>
</template>

<style lang="scss">
.feature-setting {
  .el-space {
    width: 100%;

    .el-space__item {
      width: 100%;
    }
  }

  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
