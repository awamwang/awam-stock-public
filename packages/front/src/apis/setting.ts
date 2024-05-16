import { IFocusedDepartment } from '@awamstock/model'
import { set, add } from './api/index'

export async function updateFocusedDepartment(id: string, data: IFocusedDepartment) {
  return set<IFocusedDepartment>('focused-departments', id, data)
}

export async function addFocusedDepartment(data: IFocusedDepartment) {
  return add<IFocusedDepartment>('focused-departments', data)
}
