import execa from 'execa'
import path from 'node:path'
import _ from 'lodash'

const ProjectEnv = Object.keys(process.env)
  .filter((key) => key.startsWith('AWST_') || key.startsWith('STDB_'))
  .reduce((obj, key) => ({ ...obj, [key]: process.env[key] }), {})
const PY_CWD = path.resolve(__dirname, '../../')
const PYTHONPATH = path.resolve(__dirname, '../../')
const PYTHON_EXECUTER = process.env.PYTHON_EXECUTER || 'python'

export default async function pyExec(codePath: string, cwd?: string, data?: any): Promise<string> {
  const proc = execa(PYTHON_EXECUTER, [codePath], {
    cwd: cwd || PY_CWD,
    env: {
      ...ProjectEnv,
      PYTHONPATH: PYTHONPATH,
      PYTHONIOENCODING: 'utf-8',
    },
  })

  if (!proc || !proc.stdout) {
    throw new Error(`py exca error: ${codePath}`)
  }

  // proc.stdout.pipe(process.stdout)
  const { stdout } = await proc

  return stdout
}

// export default async function runner() {
//   // await beforeStart()
//   return await pyExec().catch(console.error)
// }
