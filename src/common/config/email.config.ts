import { EmailConfig } from '../constants'

export = (): void => {
  if (!EmailConfig.EMAIL_HOST)
    throw new Error('FATAL ERROR: Email service host is not defined!')

  if (!EmailConfig.EMAIL_PORT)
    throw new Error('FATAL ERROR: Email service port is not defined!')

  if (!EmailConfig.EMAIL_USER)
    throw new Error('FATAL ERROR: Email service name is not defined!')

  if (!EmailConfig.EMAIL_PASSWORD)
    throw new Error('FATAL ERROR: Email service password is not defined!')
}
