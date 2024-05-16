import fsp from 'node:fs/promises'
import ejs from 'ejs'
import p from 'node:path'
import _ from 'lodash'

import add from '../../../../scripts/template/add'

const MODEL_DIR = p.resolve(__dirname, '../../src/models')

export default async function main() {
  const BASIC_TEMPLATE = ejs.compile(await fsp.readFile(p.resolve(__dirname, './templates/model-basic.ejs'), 'utf-8'), {})

  await add(
    {
      basic: {
        template: BASIC_TEMPLATE,
        getParams: (name) => ({
          name,
          lowerName: _.lowerFirst(name),
        }),
      },
    },
    MODEL_DIR
  )
}

if (process.argv[1].includes('model-add')) {
  main().then(() => {
    process.exit(0)
  })
}
