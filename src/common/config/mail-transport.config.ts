import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import {
  MailerOptions,
  TransportType,
} from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface'
import { join } from 'path'
import { EmailConfig } from '../constants'

/* Transport config */
const transport: TransportType = {
  host: EmailConfig.EMAIL_HOST,
  port: EmailConfig.EMAIL_PORT,
  secure: false,
  auth: {
    user: EmailConfig.EMAIL_USER,
    pass: EmailConfig.EMAIL_PASSWORD,
  },
}

/* Default config */
const defaults = { from: '"No Reply" <noreply@example.com>' }

/* Template config */
const template = {
  dir: join(__dirname, 'templates'),
  adapter: new HandlebarsAdapter(),
  options: {
    strict: true,
  },
}

export const mailerOption: MailerOptions = {
  transport,
  defaults,
  template,
}
