export interface TwoDataProp {
  data1: Record<string, string | number>
  data2: Record<string, string | number>
  k: string
  unit?: string
  reversed?: boolean
  format: (name: string | number) => string | number
}
