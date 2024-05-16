<template>
  <div class="stock-app" :style="enviromentStyle">
    <router-view v-slot="{ Component }">
      <KeepAlive v-if="$route.meta.keepAlive">
        <component :is="Component" />
      </KeepAlive>
      <component :is="Component" v-else />
    </router-view>
    <UpdaterDialog v-model="updaterShow" />
    <div class="status">
      <span>服务器连接: </span><span>{{ socketStatus }}</span> ; <span>股票监听: </span><span>{{ setStockCodeStatus }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { greenToRed } from '@awamstock/shared/browser'
import messageMixin from '@/mixins/message'
import socketDataMixin from '@/mixins/socketData'
import globalStockDataMixin from '@/mixins/globalStockData'
import useSetStockCode from '@/composables/useSetStockCode'

@VueOptions({
  computed: {
    ...mapState(useEnvironmentStore, ['temperature']),
  },
  watch: {
    socketStatus(v) {
      if (v === '断开') {
        useNotify().notify('服务器连接断开', { duration: 10 })
      }
    },
    setStockCodeStatus(v) {
      if (v === '断开') {
        useNotify().notify('股票监听断开', { duration: 10 })
      }
    },
  },
})
export default class App extends vueMixin(messageMixin, socketDataMixin, globalStockDataMixin) {
  updaterShow = false
  global = useGlobalStore()
  environment = useEnvironmentStore()
  setStockCode = useSetStockCode()

  mounted() {
    setTimeout(() => {
      if (!this.global.stockCode) {
        this.global.loadStorage()
      }
    }, 100)
  }

  get socketStatus() {
    return this.$socket.connected ? '正常' : '断开'
  }

  get setStockCodeStatus() {
    return this.setStockCode.connected ? '正常' : '断开'
  }

  get enviromentStyle() {
    return {
      backgroundColor: greenToRed(this.environment.temperature),
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/index';

html,
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: smaller;
  text-align: center;
  height: 100%;
}

#app {
  height: 100%;
}

.stock-app {
  padding: 20px;
  height: calc(100% - 40px);

  .status {
    line-height: 20px;
    text-align: right;
  }
}
</style>
