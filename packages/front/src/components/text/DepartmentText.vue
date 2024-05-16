<script setup lang="ts">
import { IFocusedDepartment } from '@awamstock/model'

const props = defineProps<{ name: string }>()

const departments = computed(() => useGlobalStore().focusedDepartmentIndexMap[props.name] || [])
const departmentToshow = computed(() => departments.value[0] || {})

function getDepartmentClass(departments: IFocusedDepartment[]) {
  if (!departments || !departments.length) {
    return ''
  }

  switch (departments[0].type) {
    case '砸盘':
      return 'department-zapan'
    case '超短':
      return 'department-chaoduan'
    default:
      return ''
  }
}
</script>

<template>
  <el-popover placement="top" :show-after="200" v-if="departments.length">
    <template #reference>
      <el-link>
        <div :class="getDepartmentClass(departments)">
          {{ departmentToshow.alias || departmentToshow.name }}
          {{ departmentToshow.power }}
          <SvgIcon icon="zaipan" color="green" v-if="departmentToshow.type === '砸盘'"></SvgIcon>
          <SvgIcon icon="short-trade" color="green" v-if="departmentToshow.type === '超短'"></SvgIcon>
        </div>
      </el-link>
    </template>
    <div class="department-detail">
      {{ departments.map((e) => e.comments?.join(','))?.join(',') }} {{ departments.map((e) => e.type).join(',') }}
      {{ departments.map((e) => e.favor?.join(','))?.join(',') }}
      {{ departmentToshow.alias ? departmentToshow.name : '' }}
    </div>
  </el-popover>
  <span v-else>{{ props.name }}</span>
</template>

<style lang="scss">
.department-zapan,
.department-chaoduan {
  text-decoration: underline;
  font-size: smaller;
}

.department-zapan {
  background-color: #f5f5f5;
}

.department-chaoduan {
  background-color: #f5f5f5;
}

.department-detail {
  font-size: smaller;
}
</style>
