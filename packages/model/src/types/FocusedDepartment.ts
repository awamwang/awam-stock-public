import { OTHER } from '@awamstock/shared/global'

const DepartmentTypes = ['砸盘', '超短', '弱势', '业务', '精明', 'T狗', OTHER] as const
export type DepartmentType = typeof DepartmentTypes[number]
