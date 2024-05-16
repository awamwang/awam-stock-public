import util from 'node:util'
import child_process from 'node:child_process'
import fsp from 'node:fs/promises'
import p from 'node:path'
import ejs from 'ejs'
import _ from 'lodash'

import add, { runMain, getTemplateParams } from '../../../../scripts/template/add'
import addController from './controller-add'

const exec = util.promisify(child_process.exec)
const FILE_NAME = p.basename(__filename)

const getParams = (name: string) => ({
  ...getTemplateParams(name),
  childPath: `${_.kebabCase(name)}/${_.kebabCase(name)}.module.ts`,
})

async function addSingleModule(name: string, dir: string) {
  await exec(`nest g module ${name} ${dir}`)
  await exec(`nest g service ${name} ${dir}`)
  await exec(`nest g controller ${name} ${dir}`)
  console.log(`[template:add nestjs] module ${name} added`)
}

export default async function main() {
  const TYPE = process.argv[2]
  const MODULE_NAME = process.argv[3]
  const DIR = process.argv[4] || 'feature'

  if (!TYPE || !MODULE_NAME) {
    // usage
    console.log(`
usage:
  node ${FILE_NAME} [type] [name,name2] [dir]
    `)
    return
  }

  const modulNames = MODULE_NAME.split(',')
  await Promise.all(modulNames.map((name) => addSingleModule(name, DIR)))

  const moduleDir = p.resolve(__dirname, `../../src/${DIR}`)
  const BASIC_TEMPLATE = ejs.compile(await fsp.readFile(p.resolve(__dirname, './templates/module-basic.ejs'), 'utf-8'), {})

  await add(
    {
      basic: { template: BASIC_TEMPLATE, getParams },
      crud: { template: BASIC_TEMPLATE, getParams },
    },
    {
      dir: moduleDir,
    }
  )
  await addController(moduleDir)
}

runMain(main, FILE_NAME)
