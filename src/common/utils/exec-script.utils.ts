import { InternalServerErrorException } from '@nestjs/common'
import { ExecException } from 'child_process'
import util from 'util'

const exec = util.promisify(require('child_process').exec)

export const execScript = async (script: string): Promise<void> => {
  const {
    error,
    stdout,
    stderr,
  }: { error: ExecException; stdout: string; stderr: string } = await exec(
    script,
  )

  if (error) throw new InternalServerErrorException(`error: ${error.message}`)

  if (stderr) throw new InternalServerErrorException(`stderr: ${stderr}`)

  console.log(`stdout: ${stdout}`)
}
