import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { join } from 'path'
import { EmailConfig } from '../constants'

/* Transport config */
export const transport = {
  host: EmailConfig.EMAIL_HOST,
  port: EmailConfig.EMAIL_PORT,
  secure: false,
  auth: {
    user: EmailConfig.EMAIL_USER,
    pass: EmailConfig.EMAIL_PASSWORD,
  },
}

/* Default config */
export const defaults = { from: '"No Reply" <noreply@example.com>' }

/* Template config */
export const template = {
  dir: join(__dirname, 'templates'),
  adapter: new HandlebarsAdapter(),
  options: {
    strict: true,
  },
}
