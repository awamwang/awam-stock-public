<script lang="ts">
import { GridOptions, ColDef, ICellEditorParams, CellValueChangedEvent, RowValueChangedEvent, ValueGetterParams, ValueSetterParams } from 'ag-grid-community'
function getFieldValueConfig(field: keyof IFocusedDepartment, type: 'array' = 'array'): ColDef {
  switch (type) {
    case 'array':
      return {
        valueGetter: (params: ValueGetterParams) => {
          return (params.data[field] || []).join(',')
        },
        valueSetter: (params: ValueSetterParams) => {
          params.data[field] = params.newValue.split(',')
          return true
        },
      }
    default:
      return {}
  }
}

function cellEditorSelector(params: ICellEditorParams<IFocusedDepartment>) {
  if (params.key === 'type') {
    return {
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['超短', '砸盘', '其他'],
      },
      popup: true,
    }
  }

  return undefined
}

// function onCellValueChanged(event: CellValueChangedEvent) {
//   console.log('onCellValueChanged: ' + event.colDef.field + ' = ' + event.newValue)
// }

function onRowValueChanged(event: RowValueChangedEvent) {
  updateFocusedDepartment(event.data._id, event.data).then(() => {
    useNotify().notify('更新营业部成功', { duration: 1 })
  })
}
</script>

<script setup lang="ts">
import { Grid } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ElMessageBox } from 'element-plus'

import { _ } from '@awamstock/shared/browser'
import { IFocusedDepartment } from '@awamstock/model'
import { focusedDepartments } from '@/apis/global'
import { updateFocusedDepartment, addFocusedDepartment } from '@/apis/setting'

const gridRef = ref(null)
const strNameMap = computed(() => useGlobalStore().strNameMap.focusedDepartment || {})
const form = ref<IFocusedDepartment>({
  name: '',
  type: '砸盘',
  alias: '',
  comments: [],
  in: [],
  out: [],
  power: 2,
  count: 1,
})
const searchText = ref('')

interface MyColDef extends ColDef {
  valueHandler?: 'array'
}
function getColumnDef(field: keyof IFocusedDepartment, def: MyColDef = {}): ColDef {
  if (def.valueHandler) {
    return {
      headerName: strNameMap.value[field],
      ...getFieldValueConfig(field, def.valueHandler),
      ..._.omit(def, 'valueHandler'),
    }
  }

  return { headerName: strNameMap.value[field], field, ...def }
}

function onSelectionChanged() {
  var selectedRows = gridOptions.api?.getSelectedRows()
  // console.log(selectedRows?.map((row) => row._id))
}

// cellEditor: 'agLargeTextCellEditor',
const gridOptions: GridOptions<IFocusedDepartment> = {
  columnDefs: [
    getColumnDef('name', { minWidth: 160, flex: 6 }),
    getColumnDef('type', {
      cellEditorSelector,
    }),
    getColumnDef('alias'),
    getColumnDef('comments', { minWidth: 100, valueHandler: 'array' }),
    getColumnDef('favor', { valueHandler: 'array' }),
    getColumnDef('in', { valueHandler: 'array' }),
    getColumnDef('out', { valueHandler: 'array' }),
    getColumnDef('power', { filter: 'agNumberColumnFilter' }),
    getColumnDef('count', { filter: 'agNumberColumnFilter' }),
  ],
  defaultColDef: {
    flex: 1,
    resizable: true,
    // suppressSizeToFit: false,
    editable: true,
    minWidth: 40,
    filter: 'agTextColumnFilter',
  },
  editType: 'fullRow',
  rowSelection: 'multiple',
  cacheQuickFilter: true,
  onSelectionChanged: onSelectionChanged,
  onRowValueChanged: onRowValueChanged,
}

async function getData() {
  const { data } = await focusedDepartments()
  gridOptions.api?.setRowData(data)
}

onMounted(async () => {
  if (!gridRef.value) return

  new Grid(gridRef.value, gridOptions)

  await getData()
  gridOptions.api?.sizeColumnsToFit()
})

// :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
// :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"

const dialogVisible = ref(false)

const beforeDialogClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

async function onSubmit() {
  console.log('onSubmit', form.value)
  await addFocusedDepartment(form.value).then(() => {
    useNotify().notify('新增营业部成功', { duration: 1 })
  })
  dialogVisible.value = false
  await getData()
}

watch(
  searchText,
  _.debounce(async (value) => {
    gridOptions.api?.setQuickFilter(value)
  }, 500)
)
</script>

<template>
  <div class="focused-department">
    <el-space alignment="flex-start" class="operators">
      <el-input v-model="searchText" placeholder="搜索" />
      <el-button type="primary" @click="dialogVisible = true">Add</el-button>
    </el-space>

    <el-dialog v-model="dialogVisible" title="创建关注营业部" width="60%" :before-close="beforeDialogClose">
      <el-form :model="form" label-width="120px">
        <el-form-item size="small" :label="strNameMap.name">
          <el-input v-model="form.name" clearable />
        </el-form-item>
        <el-form-item :label="strNameMap.type">
          <el-select v-model="form.type" placeholder="please select your zone">
            <el-option label="砸盘" value="砸盘" />
            <el-option label="超短" value="超短" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item :label="strNameMap.alias">
          <el-input v-model="form.alias" />
        </el-form-item>
        <!-- <el-form-item :label="strNameMap.comments">
          <el-input v-model="form.comments" />
        </el-form-item> -->
        <el-form-item :label="strNameMap.power">
          <el-input-number v-model="form.power" :min="1" :max="10" />
        </el-form-item>
        <el-form-item :label="strNameMap.count">
          <el-input-number v-model="form.count" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="onSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <div ref="gridRef" class="ag-theme-alpine" style="height: 90%"></div>
  </div>
</template>

<style lang="scss">
.ag-theme-alpine {
  --ag-font-size: 10px;
}

.focused-department {
  position: relative;
  height: calc(100% - 80px);
  padding: 10px;

  .operators {
    margin-bottom: 10px;
  }
}
</style>
