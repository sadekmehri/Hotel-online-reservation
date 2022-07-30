export class EmailConfig {
  static readonly EMAIL_HOST = process.env.EMAIL_HOST
  static readonly EMAIL_PORT = Number(process.env.EMAIL_PORT)
  static readonly EMAIL_USER = process.env.EMAIL_USER
  static readonly EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
}
