import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /* send email */
  async sendMail(options: ISendMailOptions) {
    await this.mailerService.sendMail(options)
  }
}
