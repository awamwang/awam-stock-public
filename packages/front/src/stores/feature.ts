// 模仿global，建立一个pinia的FeatureStore

export interface FeatureConfig {
  enable: boolean
  config?: any
}

export interface IFeatureStore {
  baoer: FeatureConfig
}

export const useFeatureStore = defineStore('feature', {
  state: (): IFeatureStore => ({
    baoer: {
      enable: true,
    },
  }),
  getters: {},
  actions: {
    // 设置feature的enable，并保存到localStorage
    setFeatureEnable(feature: string, enable: boolean) {
      this[feature].enable = enable
      localStorage.setItem(feature, JSON.stringify({ enable }))
    },
    // 从localStorage中读取feature
    loadFeatureConfig(feature: string) {
      const config = localStorage.getItem(feature)
      if (config) {
        this[feature] = JSON.parse(config)
      }
    },
    // 遍历读取所有feature
    loadAllFeatureConfig() {
      for (const feature in this) {
        if (feature !== 'loadAllFeatureConfig') {
          this.loadFeatureConfig(feature)
        }
      }
    },
  },
})
