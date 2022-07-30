import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /* send email */
  async sendMail(options: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(options)
    } catch (error) {
      throw new HttpException(
        { message: `Something wrong happened when sending the email!` },
        HttpStatus.MISDIRECTED,
      )
    }
  }
}
