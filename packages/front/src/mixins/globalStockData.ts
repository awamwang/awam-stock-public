import useGlobalSocketData from '@/composables/data/useGlobalDingpanData'

export default {
  async created() {
    const { getGlobalDingpanData } = useGlobalSocketData()
    await getGlobalDingpanData()
  },
}
