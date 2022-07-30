import path from 'path'

const root = path.resolve('./')

export class Path {
  static readonly ROOT_PATH: string = root
  static readonly EMAIL_TEMPLATE: string = `${root}\\src\\common\\mail\\`
}
