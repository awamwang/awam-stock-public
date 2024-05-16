import { App } from 'vue'
import { _ } from '@awamstock/shared/browser'

export default function register(app: App) {
  app.config.globalProperties._ = _
}
