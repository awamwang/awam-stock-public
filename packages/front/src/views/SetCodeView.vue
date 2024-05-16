<template>
  <div>code: {{ global.stockCode }}</div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import useSetStockCode from '@/composables/useSetStockCode'

@VueOptions({
  beforeRouteEnter(to, from, next: RouterNext<SetCode>) {
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
})
export default class SetCode extends Vue {
  global = useGlobalStore()
}
</script>
