import { Ref } from 'vue'
import * as G2 from '@antv/g2'
import { Types, Chart } from '@antv/g2'

import { _ } from '@awamstock/shared/browser'

let id = 1

interface GraphOptions extends Omit<Types.ChartCfg, 'container'> {
  uuid?: string
  container?: Types.ChartCfg['container']
  data: Ref<Types.Data | null>
  onInit?(chart: Chart): void
  onRender?(chart: Chart): void
}

export default function useGraph(options: GraphOptions): { uuid: Ref<string>; g2: typeof G2; chart: Chart | null; init(): void; render(): void } {
  const { onInit, onRender } = options || {}

  const uuid = ref(options.uuid || 'chart_' + id++)
  const chart: Ref<Chart | null> = ref(null)

  function render() {
    const data = options.data.value
    if (!data || _.isEmpty(data) || !chart.value) return

    // chart.value.data(data)
    _.isFunction(onRender) && onRender(chart.value)
    chart.value.render()
  }

  function init() {
    chart.value = new Chart({
      container: uuid.value,
      autoFit: true,
      syncViewPadding: true,
      ..._.omit(options, ['data', 'onInit', 'onRender']),
    })

    _.isFunction(onInit) && onInit(chart.value)
    render()
  }

  onMounted(init)

  onDeactivated(() => {
    chart.value?.destroy()
  })

  watch(options.data, render)

  return {
    uuid,
    g2: G2,
    chart: chart.value,
    init,
    render,
  }
}
