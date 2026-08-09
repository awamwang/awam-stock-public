<template>
  <div :key="stockCode">code: {{ stockCode }}</div>
</template>

<script lang="ts">
import useSetStockCode from '@/composables/useSetStockCode'

export default {
  computed: {
    ...mapState(useGlobalStore, ['stockCode']),
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
