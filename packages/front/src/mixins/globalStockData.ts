import { Vue } from 'vue-class-component'
import useGlobalSocketData from '@/composables/data/useGlobalDingpanData'

@VueOptions({})
export default class GlobalSocketMixin extends Vue {
  async created() {
    const { getGlobalDingpanData } = useGlobalSocketData()
    await getGlobalDingpanData()
  }
}
