<script setup lang="ts">
import { RefStrNameMap, IEnvironment } from '@awamstock/model'
import { $formatters } from '@U/vue/formatters'

import useEnvironmentK from '@/composables/data/useEnvironmentK'

const global = useGlobalStore()
const dingPan = useDingPanStore()
const enviromentStore = useEnvironmentStore()

const activeName = 'first'
const globalMarketList = ['CN0Y', 'IXIC', 'DJI', 'SPX', 'USDIND', 'USDCNH', 'HSI', 'FTSE', 'BRN0Y']
const enviroment = computed(() => enviromentStore.enviromentToShow)
const yesterdayEnviroment = computed(() => enviromentStore.yesterdayEnviroment)
const enviromentMap: RefStrNameMap<IEnvironment> = computed(() => global.strNameMap.enviroment || {})

const numToCn0Axis = {
  value: {
    label: {
      formatter: (text: string, item: any) => $formatters.numberToIntCn(item.id),
    },
  },
}
const tempratureK = useEnvironmentK('temperature', {
  formatter: $formatters.toIntNumber,
  scale: {
    value: { min: 0, max: 100 },
  },
})

function fundK(key: keyof IEnvironment) {
  return useEnvironmentK(key, {
    formatter: $formatters.toIntNumber,
    scale: {
      // value: { min: 0, max: 100 },
      value: {
        formatter: $formatters.numberToCn,
      },
    },
  })
}
const mNetK = fundK('m_net')
const stonNetK = fundK('net_s2n')
</script>

<template>
  <el-container class="dingpan">
    <el-header>
      <div class="environment-detial">
        <el-space wrap spacer="|" v-if="enviroment.temperature">
          <FSLinePopover v-bind="tempratureK">
            <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="temperature" :strNameMap="enviromentMap" />
          </FSLinePopover>
          <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="n_up" :strNameMap="enviromentMap" />
          <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="n_down" :strNameMap="enviromentMap" reversed />
          <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="n_sjzt" :strNameMap="enviromentMap" />
          <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="n_sjdt" :strNameMap="enviromentMap" reversed />
          <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="v_sh" :strNameMap="enviromentMap" :format="$formatters.numberToIntCn" />
          <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="v_ca" :strNameMap="enviromentMap" :format="$formatters.numberToIntCn" />
          <FSLinePopover :axis="numToCn0Axis" v-bind="mNetK">
            <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="m_net" :strNameMap="enviromentMap" :format="$formatters.numberToCn" />
          </FSLinePopover>
          <FSLinePopover :axis="numToCn0Axis" v-bind="stonNetK">
            <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="net_s2n" :strNameMap="enviromentMap" :format="$formatters.numberToCn" />
          </FSLinePopover>
          <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="broken_r" :name="enviromentMap.broken_r + '(%)'" :format="$formatters.toFixed" reversed />
          <TwoDataCard :data1="enviroment" :data2="yesterdayEnviroment" k="zt_avg_zr" :name="enviromentMap.zt_avg_zr + '(%)'" :format="$formatters.toFixed" />

          <el-card>量能对比昨日</el-card>
          <el-card>量能5日，量比</el-card>
        </el-space>

        <el-skeleton :rows="3" v-else />
      </div>

      <div class="mood-detial">
        <el-space wrap v-if="dingPan.moodBlocks.length">
          <MoodBlockCard :list="dingPan.moodBlocks" :index="0"></MoodBlockCard>
          <MoodBlockCard :list="dingPan.moodBlocks" :index="1"></MoodBlockCard>
          <MoodBlockCard :list="dingPan.moodBlocks" :index="2"></MoodBlockCard>
        </el-space>

        <el-skeleton :rows="1" v-else />
      </div>

      <div class="global-market-detial">
        <el-space wrap spacer="|" v-if="enviromentStore.globalMarketData">
          <template v-for="k in globalMarketList">
            <TwoDataCard
              :data1="enviromentStore.globalMarketData[k]"
              k="increase_rate"
              :name="enviromentStore.globalMarketData[k].name"
              :key="k"
              :compare="(data1) => $formatters.extractNumber(data1) > 0"
              v-if="enviromentStore.globalMarketData[k]"
            />
          </template>
        </el-space>

        <el-skeleton :rows="1" v-else />
      </div>
    </el-header>

    <div class="border-dashed" />

    <el-tabs v-model="activeName">
      <el-main>
        <el-tab-pane label="个股" name="first">
          <DingPanStock />
        </el-tab-pane>
        <el-tab-pane label="板块" name="second">
          <DingPanBlock />
        </el-tab-pane>
        <el-tab-pane label="连板" name="third">
          <DingPanLb />
        </el-tab-pane>
        <el-tab-pane label="龙头" name="fourth">
          <DingPanLongtou />
        </el-tab-pane>
        <el-tab-pane label="消息" name="fifth"><MarketMessageTable :data="dingPan.marketMessages"></MarketMessageTable></el-tab-pane>
      </el-main>
    </el-tabs>
  </el-container>
</template>

<style lang="scss">
.el-header {
  height: auto;
  padding: 10px 20px;

  .el-space {
    justify-content: space-around;
  }

  .mood-detial,
  .global-market-detial {
    margin: 10px 0;
  }

  .el-card {
    .el-card__header {
      padding: 5px 10px;
    }

    .el-card__body {
      padding: 5px 10px;
    }
  }
}

.el-main {
  padding-top: 20px;
  box-shadow: var(--el-box-shadow);
}
</style>
