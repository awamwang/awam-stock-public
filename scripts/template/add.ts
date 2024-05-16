import fs from 'node:fs'
import fsp from 'node:fs/promises'
import p from 'node:path'
import { TemplateFunction } from 'ejs'
import readline from 'node:readline'
import _ from 'lodash'

export interface AddOptions {
  dir?: string
  childDir?: boolean | string
}

export interface TemplatemMap {
  [key: string]: {
    template: TemplateFunction
    getParams?: (name: string) => { [key: string]: any }
  }
}

async function question(q: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return await new Promise((resolve, reject) => {
    rl.question(q, (input) => {
      // rl.close()
      resolve(input)
    })
  })
}

let myType: string
let myTemplateMap: TemplatemMap
let myBasicDir = p.resolve(__dirname)
let myChildDir: AddOptions['childDir'] = ''
/**
 *
 */
async function getOptions(): Promise<{ type: string; names: string[] }> {
  let nameInput

  const availableTypes = Object.keys(myTemplateMap)
  if (process.argv[2]) {
    myType = process.argv[2]
  }

  if (!availableTypes.includes(myType)) {
    const defaultType = availableTypes[0]
    myType = await question(`myType?-${availableTypes.join('|')}: `)
    if (!myType.length) {
      myType = defaultType
    }
  }

  if (process.argv[3]) {
    nameInput = process.argv[3]
  } else {
    nameInput = await question('names?-([name1],[name2]): ')
  }

  const names = nameInput.split(',').map((e) => e.trim())
  if (!names || !names.length) {
    throw '[template:add] no name specified!'
  }

  return {
    type: myType,
    names,
  }
}

async function genByType({ type, path, name }: { type: string; path: string; name: string }) {
  const template = myTemplateMap[type]
  const params = template.getParams ? template.getParams(name) : { name }
  const fileStr = template.template(params)

  if (params.childPath) {
    path = p.resolve(p.dirname(path), params.childPath)
  }

  await fsp.writeFile(path, fileStr, {
    encoding: 'utf-8',
    flag: 'w',
  })

  return name
}

async function genFile(name: string): Promise<string> {
  const dir = myBasicDir
  const path = dir + p.sep + name + '.ts'

  // console.log(fs.existsSync(dir), dir)
  if (!fs.existsSync(dir)) {
    await fsp.mkdir(dir)
  }

  if (fs.existsSync(path)) {
    const y_n = await question(`file exist: ${name} continue?(y/n): `)
    if (y_n !== 'y') {
      return ''
    }
  }

  await genByType({ type: myType, path, name })
  return name
}

function report(succNames: string[], allNames: string[]) {
  const existNames = allNames.filter((e) => !succNames.includes(e))
  console.log(`成功生成文件: ${succNames.join(', ')}`)
  console.log(`已经存在文件: ${existNames.join(', ')}`)
}

export default async function add(map: TemplatemMap, options: AddOptions = {}) {
  const { dir, childDir } = options

  myTemplateMap = map
  myBasicDir = dir || myBasicDir
  myChildDir = childDir || myChildDir
  const { names } = await getOptions()
  console.log(`[template:add] type-${myType} start...`, names)

  const succNames = await Promise.all(names.map(genFile))
  report(succNames, names)
}

// await add()

export function runMain(main: () => Promise<any>, fileName: string) {
  if (p.basename(process.argv[1]) === fileName) {
    main().then(() => {
      process.exit(0)
    })
  }
}

export function getTemplateParams(name: string) {
  return {
    name,
    upperFirstCamelCaseName: _.upperFirst(_.camelCase(name)),
    lowerName: _.lowerFirst(name),
    lowerFirstCamelCaseName: _.lowerFirst(_.camelCase(name)),
    kebabCaseName: _.kebabCase(name),
    childPath: `/${_.kebabCase(name)}`,
  }
}
