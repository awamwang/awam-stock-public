<template>
  <div>code: {{ global.stockCode }}</div>
</template>

<script lang="ts">
import useSetStockCode from '@/composables/useSetStockCode'

export default {
  data() {
    return {
      global: useGlobalStore(),
    }
  },
  beforeRouteEnter(to, from, next: RouterNext) {
    next(() => {
      const { update } = useSetStockCode()

      const { id } = to.params
      if (typeof id === 'string') {
        update(id)
      } else {
        next()
      }
    })
  },
}
</script>
