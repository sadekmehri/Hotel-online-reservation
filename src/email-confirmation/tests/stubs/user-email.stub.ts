import { SendEmailDto } from 'src/email-confirmation/dtos'

export const userSendConfirmationEmail = (): SendEmailDto => {
  return {
    email: 'xxx@gmail.com',
  }
}
