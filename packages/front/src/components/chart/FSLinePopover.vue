<script setup lang="ts">
import { Ref } from 'vue'

import { PlainDataModel } from '@awamstock/shared/type'

const props = withDefaults(defineProps<{ data: Ref<PlainDataModel[] | null>; getData: () => void }>(), {})
const { data, getData } = toRefs(props)
const attrs = useAttrs()
</script>

<template>
  <el-popover :width="300" placement="bottom" trigger="hover" :show-after="300" @show="getData" v-bind="attrs">
    <template #reference>
      <slot></slot>
    </template>
    <FSLine :data="data" v-bind="attrs"></FSLine>
  </el-popover>
</template>
