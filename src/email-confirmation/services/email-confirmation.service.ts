import { ISendMailOptions } from '@nestjs-modules/mailer'
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from 'src/auth/services/auth.service'
import { Jwt, Path } from 'src/common/constants'
import { EmailService } from 'src/email/email.service'
import { VerificationTokenPayload } from '../types'

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) {}

  /* Send verification link throw email */
  async sendVerificationLink(email: string): Promise<void> {
    const payload: VerificationTokenPayload = { email }

    const token = await this.generateToken(payload)

    const options: ISendMailOptions = {
      to: email,
      subject: 'Email confirmation',
      template: `${Path.EMAIL_TEMPLATE}\\mail-confirmation`,
      context: {
        email,
        token,
      },
    }

    await this.emailService.sendMail(options)
  }

  /* Send verification process */
  async sendConfirmationProcess(email: string): Promise<void> {
    const { isEmailConfirmed } = await this.authService.getAuthByEmail(email)

    if (isEmailConfirmed)
      throw new HttpException(
        { message: `Email already confirmed!` },
        HttpStatus.BAD_REQUEST,
      )

    await this.sendVerificationLink(email)
  }

  /* Resend confirmation request */
  async resendConfirmationLink(userId: number): Promise<void> {
    const { isEmailConfirmed, email } = await this.authService.getAuthInfo(
      userId,
    )

    if (isEmailConfirmed)
      throw new HttpException(
        { message: `Email already confirmed!` },
        HttpStatus.BAD_REQUEST,
      )

    await this.sendVerificationLink(email)
  }

  /* Confirm auth account */
  async confirmEmail(email: string): Promise<void> {
    const { isEmailConfirmed } = await this.authService.getAuthByEmail(email)

    if (isEmailConfirmed)
      throw new HttpException(
        { message: `Email already confirmed!` },
        HttpStatus.BAD_REQUEST,
      )

    await this.authService.markEmailAsConfirmed(email)
  }

  /* Decode token after clicking confirm link */
  async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = <VerificationTokenPayload>await this.jwtService.verify(
        token,
        {
          secret: Jwt.EMAIL_TOKEN_SECRET,
        },
      )

      if ('email' in payload) return payload.email

      throw new BadRequestException()
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError')
        throw new BadRequestException('Email confirmation token expired!')

      throw new BadRequestException('Bad confirmation token!')
    }
  }

  /* Generate email verification token */
  async generateToken(payload: VerificationTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: Jwt.EMAIL_TOKEN_SECRET,
      expiresIn: Jwt.EXPIRES_IN_EMAIL_TOKEN,
    })
  }
}
