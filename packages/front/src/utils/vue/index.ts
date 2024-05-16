import { App } from 'vue'
import { Router } from 'vue-router'

import regiterFilters from './formatters'
import regiterLodash from './lodash'
import registerErrorHandler from './error'

export default function register(app: App, router: Router) {
  registerErrorHandler(app, router)
  regiterFilters(app)
  regiterLodash(app)
}
