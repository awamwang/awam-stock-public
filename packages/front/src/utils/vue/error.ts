import { App } from 'vue'
import { Router } from 'vue-router'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

import { isProd } from '@/utils/env'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN

export default function registerErrorHandler(app: App, router: Router) {
  isProd &&
    Sentry.init({
      app,
      dsn: sentryDsn,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ['localhost:3000', /^\//],
        }),
      ],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    })

  app.config.errorHandler = (err, vm, info) => {
    console.error(`Vue global catched\n ${info}\n`, err)
  }
}
