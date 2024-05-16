import { I18n } from 'i18n'
import path from 'path'

const i18n = new I18n()
i18n.configure({
  locales: ['en', 'zh-cn'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'zh-cn',
  extension: '.json',
  objectNotation: true,
})

export default i18n

export const l = i18n.__.bind(i18n)
