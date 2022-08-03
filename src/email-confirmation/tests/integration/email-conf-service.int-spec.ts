import { faker } from '@faker-js/faker'
import { MailerModule } from '@nestjs-modules/mailer'
import {
  CanActivate,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from 'src/auth/auth.module'
import { AuthService } from 'src/auth/services/auth.service'
import { loginUserStub, registerUserStub } from 'src/auth/test/stubs/user.stub'
import { mailerOption } from 'src/common/config/mail-transport.config'
import { AccessTokenGuard, RoleGuard } from 'src/common/guards'
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module'
import { EmailConfirmationService } from 'src/email-confirmation/services/email-confirmation.service'
import { VerificationTokenPayload } from 'src/email-confirmation/types'
import { PrismaService } from 'src/prisma/prisma.service'
import request from 'supertest'
import { userSendConfirmationEmail } from '../stubs/user-email.stub'

describe('Email confirmation service', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let authService: AuthService
  let reflector: Reflector
  let emailConfirmationService: EmailConfirmationService

  // utils
  let server: any
  let guards: CanActivate[]
  const baseUrl: string = '/account'
  const registerUser = registerUserStub()
  const loginUser = loginUserStub()
  const userEmailConfirmation = userSendConfirmationEmail()
  const { email } = registerUser
  const payload: VerificationTokenPayload = { email }

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        MailerModule.forRoot(mailerOption),
        AuthModule,
        EmailConfirmationModule,
      ],
    }).compile()

    prismaService = moduleRef.get<PrismaService>(PrismaService)
    authService = moduleRef.get<AuthService>(AuthService)
    emailConfirmationService = moduleRef.get<EmailConfirmationService>(
      EmailConfirmationService,
    )

    app = moduleRef.createNestApplication()
    reflector = app.get(Reflector)
    app.useGlobalPipes(new ValidationPipe())
    guards = [
      new AccessTokenGuard(reflector),
      new RoleGuard(reflector, authService),
    ]
    app.useGlobalGuards(...guards)
    server = app.getHttpServer()

    await app.init()
  })

  afterEach(async () => {
    await prismaService.truncate()
    await prismaService.$disconnect()
  })

  afterAll(async () => {
    await app.close()
  })

  it('-> Should be defined', () => {
    expect(prismaService).toBeDefined()
    expect(authService).toBeDefined()
    expect(emailConfirmationService).toBeDefined()
  })

  // Send verification link feature tests
  describe('Send verification link feature', () => {
    it('-> Should reject while form validation', async () => {
      const { status } = await request(server)
        .post(`${baseUrl}/send-confirmation-link`)
        .send()

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it("-> Should reject when the user email doesn't exist", async () => {
      const email = faker.internet.email()

      await authService.register(registerUser)

      const { status } = await request(server)
        .post(`${baseUrl}/send-confirmation-link`)
        .send({ email })

      expect(status).toBe(HttpStatus.NOT_FOUND)
    })

    it('-> Should reject when the user email is verified', async () => {
      await authService.register(registerUser)

      await prismaService.users.update({
        where: { email: registerUser.email },
        data: { isEmailConfirmed: true },
      })

      const { status } = await request(server)
        .post(`${baseUrl}/send-confirmation-link`)
        .send(userEmailConfirmation)

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should pass then send email verification to user mail', async () => {
      await authService.register(registerUser)

      const { status } = await request(server)
        .post(`${baseUrl}/send-confirmation-link`)
        .send(userEmailConfirmation)

      expect(status).toBe(HttpStatus.OK)
    })
  })

  // Account verification feature tests
  describe('Account verification feature', () => {
    it('-> Should reject when the verification token is not provided', async () => {
      const { status } = await request(server).get(`${baseUrl}/confirm`).send()

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should reject when the verification token is wrong', async () => {
      const token = faker.random.alpha(25)

      const { status } = await request(server)
        .get(`${baseUrl}/confirm?token=${token}`)
        .send()

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it("-> Should reject he user email doesn't exist", async () => {
      const email = faker.internet.email()
      const payload: VerificationTokenPayload = { email }

      const token = await emailConfirmationService.generateToken(payload)

      const { status } = await request(server)
        .get(`${baseUrl}/confirm?token=${token}`)
        .send()

      expect(status).toBe(HttpStatus.NOT_FOUND)
    })

    it('-> Should reject when user email is verified', async () => {
      await authService.register(registerUser)
      await prismaService.users.update({
        data: { isEmailConfirmed: true },
        where: { email },
      })
      const token = await emailConfirmationService.generateToken(payload)

      const { status } = await request(server)
        .get(`${baseUrl}/confirm?token=${token}`)
        .send()

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should pass after validation process', async () => {
      await authService.register(registerUser)
      const token = await emailConfirmationService.generateToken(payload)

      const { status } = await request(server)
        .get(`${baseUrl}/confirm?token=${token}`)
        .send()

      expect(status).toBe(HttpStatus.NO_CONTENT)
    })
  })

  // Resend mail verification feature tests
  describe('Resend mail verification feature', () => {
    it('-> Should reject when the user is not authenticated', async () => {
      const { status } = await request(server)
        .post(`${baseUrl}/resend-confirmation-link`)
        .set('Authorization', `Bearer`)
        .send()

      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should reject when the user is admin', async () => {
      await authService.register(registerUser)
      const { accessToken } = await authService.login(loginUser)

      await prismaService.users.update({
        where: { email },
        data: { isAdmin: true },
      })

      const { status } = await request(server)
        .post(`${baseUrl}/resend-confirmation-link`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })

    it("-> Should reject when the user wasn't found", async () => {
      await authService.register(registerUser)
      const { accessToken } = await authService.login(loginUser)

      await prismaService.users.delete({ where: { email } })

      const { status } = await request(server)
        .post(`${baseUrl}/resend-confirmation-link`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(status).toBe(HttpStatus.NOT_FOUND)
    })

    it('-> Should reject when the user account is verified', async () => {
      await authService.register(registerUser)
      const { accessToken } = await authService.login(loginUser)

      await prismaService.users.update({
        where: { email },
        data: { isEmailConfirmed: true },
      })

      const { status } = await request(server)
        .post(`${baseUrl}/resend-confirmation-link`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should pass after validation process', async () => {
      await authService.register(registerUser)
      const { accessToken } = await authService.login(loginUser)

      const { status } = await request(server)
        .post(`${baseUrl}/resend-confirmation-link`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(status).toBe(HttpStatus.OK)
    })
  })
})
