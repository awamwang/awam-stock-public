<script setup lang="ts">
import { PlainDataModel } from '@awamstock/shared/type'
import { SortValues, ArraySortOptions, persistentSort } from '@awamstock/shared/browser'

let uuid = 1
const props = withDefaults(
  defineProps<{
    persistentKey?: string
    data: PlainDataModel[]
    tiny?: boolean
    defaultSort?: {
      prop: string
      order: SortValues
    }
  }>(),
  {}
)
const tableRef = ref()

const sortProp = ref(props.defaultSort?.prop)
const sortOrder = ref(props.defaultSort?.order)

function updateSort<T>(sortOptions: ArraySortOptions<T>) {
  if (sortOptions.sort && sortOptions.prop) {
    onSortChange({
      _: null,
      prop: sortOptions.prop as string,
      order: sortOptions.sort,
    })
  }
}

const tableData = computed(() => {
  const savedSortOptions = persistentSort<PlainDataModel>(props.data, {
    key: props.persistentKey || `sort_table_${uuid++}`,
    sortIteratee: sortProp.value as keyof PlainDataModel,
    sort: sortOrder.value as SortValues,
  })
  updateSort<PlainDataModel>(savedSortOptions)

  return props.data
})

function onSortChange(options: { _: unknown; prop: string; order: SortValues }) {
  if (sortProp.value !== options.prop) {
    sortProp.value = options.prop
  }
  if (sortOrder.value !== options.order) {
    sortOrder.value = options.order
  }
}

defineExpose({
  resetPage: () => tableRef.value?.reset(),
})
</script>

<template>
  <PaginationTable ref="tableRef" :data="tableData" :defaultSort="{ prop: sortProp, order: sortOrder }" @sort-change="onSortChange" v-if="tableData">
    <slot></slot>
  </PaginationTable>
</template>
