import fsp from 'node:fs/promises'
import ejs from 'ejs'
import p from 'node:path'
import _ from 'lodash'

import add, { runMain, getTemplateParams } from '../../../../scripts/template/add'

const FILE_NAME = p.basename(__filename)
const CONTROLLER_DIR = p.resolve(__dirname, '../../feature/controller')

const getParams = (name: string) => ({
  ...getTemplateParams(name),
  childPath: `${_.kebabCase(name)}/${_.kebabCase(name)}.controller.ts`,
})

export default async function addController(dir: string = CONTROLLER_DIR) {
  const BASIC_TEMPLATE = ejs.compile(await fsp.readFile(p.resolve(__dirname, './templates/controller-basic.ejs'), 'utf-8'), {})
  const CRUD_TEMPLATE = ejs.compile(await fsp.readFile(p.resolve(__dirname, './templates/controller-crud.ejs'), 'utf-8'), {})

  await add(
    {
      basic: {
        template: BASIC_TEMPLATE,
        getParams,
      },
      crud: {
        template: CRUD_TEMPLATE,
        getParams,
      },
    },
    { dir }
  )
}

runMain(addController, FILE_NAME)
