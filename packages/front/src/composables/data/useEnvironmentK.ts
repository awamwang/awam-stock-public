import { Ref } from 'vue'
import { Types } from '@antv/g2'

import { IEnvironment } from '@awamstock/model'
import { environments } from '@/apis/global'

export default function (field: keyof IEnvironment, options: { date?: string; formatter?: (val: any) => number; scale?: Record<string, any> } = {}) {
  const data: Ref<Types.Data> = ref([])
  const date = computed(() => useEnvironmentStore().dateToShow)

  function getData() {
    return environments({ date: options.date || date.value, _fields: `${field},createdAt`, _noStrNameMap: 1, _sort: 'createdAt' }).then((res) => {
      data.value = res.data.map((item) => ({
        time: item.createdAt,
        value: options.formatter ? options.formatter(item[field]) : item[field],
      }))
    })
  }

  return {
    date,
    data,
    getData,
    scale: options.scale || {},
  }
}
