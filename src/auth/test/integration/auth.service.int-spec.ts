import {
  HttpException,
  HttpStatus,
  INestApplication,
  ValidationPipe
} from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from 'src/auth/auth.module'
import { AuthService } from 'src/auth/services/auth.service'
import { Tokens } from 'src/auth/types'
import { AccessTokenGuard } from 'src/common/guards'
import { PrismaService } from 'src/prisma/prisma.service'
import request from 'supertest'
import { loginUserStub, registerUserStub } from '../stubs/user.stub'

describe('AuthService', () => {
  // Data
  const baseUrl: string = '/auth'
  const registerUser = registerUserStub()
  const loginUser = loginUserStub()
  const prismaUserData = {
    ...registerUser,
    dob: new Date(registerUser.dob),
  }

  let app: INestApplication
  let prismaService: PrismaService
  let authService: AuthService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
    }).compile()

    prismaService = moduleRef.get<PrismaService>(PrismaService)
    authService = moduleRef.get<AuthService>(AuthService)
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())

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
    expect(authService).toBeDefined()
  })

  // Register auth feature tests
  describe('Register auth feature', () => {
    it('-> Should throw while form validation', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/register`)
        .send({})

      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should throw when the user cin exists', async () => {
      await prismaService.users.create({ data: prismaUserData })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/register`)
        .send(registerUser)

      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should throw when the user email exists', async () => {
      await prismaService.users.create({ data: prismaUserData })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/register`)
        .send({
          ...registerUser,
          cin: '10000000',
        })

      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should pass after form validation', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/register`)
        .send(registerUser)

      expect(res.status).toBe(HttpStatus.CREATED)
    })
  })

  // Login auth feature tests
  describe('Login auth feature', () => {
    it('-> Should throw while form validation', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send({})

      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
    })

    it("-> Should throw when email doesn't exist", async () => {
      await authService.register(registerUser)

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send({
          email: 'something-else@gmail.com',
          password: '000',
        })

      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should throw when the user password is wrong', async () => {
      await authService.register(registerUser)

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send({
          ...loginUser,
          password: 'somethingwrong',
        })

      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should throw when the user account is blocked', async () => {
      await authService.register(registerUser)
      await prismaService.users.update({
        where: { email: registerUser.email },
        data: { isActive: false },
      })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send(loginUser)

      expect(res.status).toBe(HttpStatus.FORBIDDEN)
    })

    it('-> Should pass after account validation', async () => {
      await authService.register(registerUser)

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send(loginUser)

      expect(res.status).toBe(HttpStatus.OK)
    })
  })

  // Refresh token feature tests
  describe('Refresh token feature', () => {
    it('-> Should throw when auth provide wrong bearer token', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer `)
        .send()

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should throw when the auth doesnt have refesh token (someone steals the tokens)', async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)
      await prismaService.users.update({
        where: { email: registerUser.email },
        data: { refreshToken: null },
      })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.FORBIDDEN)
    })

    it("-> Should throw when refresh token doest't match", async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)
      await prismaService.users.update({
        where: { email: loginUser.email },
        data: { refreshToken: 'other-token' },
      })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.FORBIDDEN)
    })

    it('-> Should pass and generate new tokens', async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.OK)
    })
  })

  // Refresh token feature test
  describe('Refresh token feature', () => {
    it('-> Should throw when auth provide wrong bearer token', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer `)
        .send()

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should throw when the auth doesnt have refresh token (someone steals the tokens)', async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)
      await prismaService.users.update({
        where: { email: registerUser.email },
        data: { refreshToken: null },
      })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.FORBIDDEN)
    })

    it("-> Should throw when refresh token doest't match", async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)
      await prismaService.users.update({
        where: { email: loginUser.email },
        data: { refreshToken: 'other-token' },
      })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.FORBIDDEN)
    })

    it('-> Should throw when auth logout and tries to refresh token', async () => {
      const newUser = await authService.register(registerUser)
      const tokens = await authService.login(loginUser)
      await authService.logout(newUser.userId)

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.FORBIDDEN)
    })

    it('-> Should pass and generate new tokens', async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.OK)
    })
  })

  // Get authenticated user details test
  describe('Get authenticated user details feature', () => {
    it('-> Should throw when auth provide wrong bearer token', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/me`)
        .set('Authorization', `Bearer `)
        .send()

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should reject when the auth account is blocked', async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)
      await prismaService.users.update({
        where: { email: registerUser.email },
        data: { isActive: false },
      })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should pass and get auth details', async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.OK)
    })
  })

  // Logout auth feature tests
  describe('Logout auth feature feature', () => {
    it('-> Should throw when auth provide wrong bearer token', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/logout`)
        .set('Authorization', `Bearer `)
        .send()

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should reject when the auth account is blocked', async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)
      await prismaService.users.update({
        where: { email: registerUser.email },
        data: { isActive: false },
      })

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/logout`)
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should pass and logout from auth account', async () => {
      await authService.register(registerUser)
      const tokens: Tokens = await authService.login(loginUser)

      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/logout`)
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send()

      expect(res.status).toBe(HttpStatus.OK)
    })
  })

  // Get user details by email tests
  describe('Get user details by email', () => {
    it("-> Should reject when the email doesn't exist", async () => {
      await authService.register(registerUser)
      const getAuthByEmail = async () => {
        await authService.getAuthByEmail('some-random@gmail.com')
      }
      await expect(getAuthByEmail).rejects.toThrowError(HttpException)
    })

    it('-> Should pass and return the given user informations', async () => {
      await authService.register(registerUser)
      const myTest = async () =>
        await authService.getAuthByEmail(registerUser.email)
      expect(myTest).not.toThrow()
    })
  })

  // Get user details by id tests
  describe('Get user details by id', () => {
    it("-> Should reject when the user doesn't exist", async () => {
      const getAuthById = async () => {
        await authService.getAuthById(0)
      }
      await expect(getAuthById).rejects.toThrowError(HttpException)
    })

    it('-> Should pass and return the given user informations', async () => {
      const newUser = await authService.register(registerUser)
      const myTest = async () => await authService.getAuthById(newUser.userId)
      expect(myTest).not.toThrow()
    })
  })
})
