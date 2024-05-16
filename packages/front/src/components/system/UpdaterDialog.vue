<script setup lang="ts">
import { UpdateDownloadedEvent } from 'electron-updater'

const props = defineProps<{
  modelValue: boolean
}>()
const { modelValue } = toRefs(props)
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const hint = ref('正在更新版本，更新后，软件将自动重启安装...')

const percentage = ref(0)

onMounted(() => {
  if (window.electronAPI) {
    window.electronAPI.onMessage('update-available', () => {
      emit('update:modelValue', true)
    })
    window.electronAPI.onMessage('update-downloaded', () => {
      hint.value = '更新完成'
    })

    window.electronAPI.onDownloadProgress((event: UpdateDownloadedEvent, p: string) => {
      percentage.value = Number(Number(p).toFixed(2))
    })
  }
})
</script>

<template>
  <el-dialog v-model="modelValue" title="更新啦" width="30%" center :close-on-click-modal="false">
    <p><el-progress :percentage="percentage"></el-progress></p>
    <div>{{ hint }}</div>
    <p>该窗口可关闭，但更新依然进行</p>
  </el-dialog>
</template>

<style lang="scss">
.el-dialog {
  .el-dialog__body {
    padding-top: 0;
    text-align: center;
  }
}
</style>
