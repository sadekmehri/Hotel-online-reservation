import { faker } from '@faker-js/faker'
import {
  HttpException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthModule } from 'src/auth/auth.module'
import { LoginAuthDto } from 'src/auth/dtos'
import { AuthService } from 'src/auth/services/auth.service'
import { AccessTokenGuard } from 'src/common/guards'
import { PrismaService } from 'src/prisma/prisma.service'
import request from 'supertest'
import { loginUserStub, registerUserStub } from '../stubs/user.stub'

describe('AuthService', () => {
  let app: INestApplication
  let prismaService: PrismaService
  let authService: AuthService
  let server: any

  // utils
  const baseUrl: string = '/auth'
  const registerUser = registerUserStub()
  const loginUser = loginUserStub()
  const { email } = registerUser
  const prismaUserData = {
    ...registerUser,
    dob: new Date(registerUser.dob),
  }

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
    }).compile()

    prismaService = moduleRef.get<PrismaService>(PrismaService)
    authService = moduleRef.get<AuthService>(AuthService)

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
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
    expect(authService).toBeDefined()
    expect(prismaService).toBeDefined()
  })

  // Register auth feature tests
  describe('Register auth feature', () => {
    it('-> Should reject while form validation', async () => {
      const { status } = await request(server)
        .post(`${baseUrl}/register`)
        .send({})

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should reject when the user cin exists', async () => {
      await prismaService.users.create({ data: prismaUserData })

      const { status } = await request(server)
        .post(`${baseUrl}/register`)
        .send(registerUser)

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should reject when the user email exists', async () => {
      const cin = faker.random.numeric(8)

      await prismaService.users.create({ data: prismaUserData })

      const { status } = await request(server)
        .post(`${baseUrl}/register`)
        .send({
          ...registerUser,
          cin,
        })

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should pass after form validation', async () => {
      const { status } = await request(server)
        .post(`${baseUrl}/register`)
        .send(registerUser)

      expect(status).toBe(HttpStatus.CREATED)
    })
  })

  // Login auth feature tests
  describe('Login auth feature', () => {
    it('-> Should reject while form validation', async () => {
      const { status } = await request(server).post(`${baseUrl}/login`).send()

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it("-> Should reject when email doesn't exist", async () => {
      const user: LoginAuthDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      }

      await authService.register(registerUser)

      const { status } = await request(server)
        .post(`${baseUrl}/login`)
        .send(user)

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should reject when the user password is wrong', async () => {
      const password = faker.internet.password()

      await authService.register(registerUser)

      const { status } = await request(server)
        .post(`${baseUrl}/login`)
        .send({
          ...loginUser,
          password,
        })

      expect(status).toBe(HttpStatus.BAD_REQUEST)
    })

    it('-> Should reject when the user account is blocked', async () => {
      await authService.register(registerUser)

      await prismaService.users.update({
        where: { email },
        data: { isActive: false },
      })

      const { status } = await request(server)
        .post(`${baseUrl}/login`)
        .send(loginUser)

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })

    it('-> Should pass after account validation', async () => {
      await authService.register(registerUser)

      const { status } = await request(server)
        .post(`${baseUrl}/login`)
        .send(loginUser)

      expect(status).toBe(HttpStatus.OK)
    })
  })

  // Refresh token feature test
  describe('Refresh token feature', () => {
    it('-> Should reject when auth provide wrong bearer token', async () => {
      const { status } = await request(server)
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer `)
        .send()

      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it("-> Should reject when the auth doesn't have refresh token", async () => {
      await authService.register(registerUser)
      const { refreshToken } = await authService.login(loginUser)

      await prismaService.users.update({
        where: { email },
        data: { refreshToken: null },
      })

      const { status } = await request(server)
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .send()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })

    it("-> Should reject when refresh token doesn't match", async () => {
      await authService.register(registerUser)
      const { refreshToken } = await authService.login(loginUser)

      await prismaService.users.update({
        where: { email },
        data: { refreshToken: faker.random.alpha(25) },
      })

      const { status } = await request(server)
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .send()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })

    it('-> Should reject when auth logout and tries to refresh token', async () => {
      const newUser = await authService.register(registerUser)
      const { refreshToken } = await authService.login(loginUser)
      await authService.logout(newUser.userId)

      const { status } = await request(server)
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .send()

      expect(status).toBe(HttpStatus.FORBIDDEN)
    })

    it('-> Should pass and generate new tokens', async () => {
      await authService.register(registerUser)
      const { refreshToken } = await authService.login(loginUser)

      const { status } = await request(server)
        .post(`${baseUrl}/refresh`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .send()

      expect(status).toBe(HttpStatus.OK)
    })
  })

  // Get authenticated user details test
  describe('Get authenticated user details feature', () => {
    it('-> Should reject when auth provide wrong bearer token', async () => {
      const { status } = await request(server)
        .post(`${baseUrl}/me`)
        .set('Authorization', `Bearer `)
        .send()

      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should reject when the auth account is blocked', async () => {
      await authService.register(registerUser)
      const { accessToken } = await authService.login(loginUser)

      await prismaService.users.update({
        where: { email },
        data: { isActive: false },
      })

      const { status } = await request(server)
        .post(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should pass and get auth details', async () => {
      await authService.register(registerUser)
      const { accessToken } = await authService.login(loginUser)

      const { status } = await request(server)
        .post(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(status).toBe(HttpStatus.OK)
    })
  })

  // Logout auth feature tests
  describe('Logout auth feature feature', () => {
    it('-> Should reject when auth provide wrong bearer token', async () => {
      const { status } = await request(server)
        .post(`${baseUrl}/logout`)
        .set('Authorization', `Bearer `)
        .send()

      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should reject when the auth account is blocked', async () => {
      await authService.register(registerUser)
      const { accessToken } = await authService.login(loginUser)

      await prismaService.users.update({
        where: { email },
        data: { isActive: false },
      })

      const { status } = await request(server)
        .post(`${baseUrl}/logout`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(status).toBe(HttpStatus.UNAUTHORIZED)
    })

    it('-> Should pass and logout from auth account', async () => {
      await authService.register(registerUser)
      const { accessToken } = await authService.login(loginUser)

      const { status } = await request(server)
        .post(`${baseUrl}/logout`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(status).toBe(HttpStatus.OK)
    })
  })

  // Get user details by id tests
  describe('Get user details', () => {
    it("-> Should reject when user by email doesn't exist", async () => {
      const email = faker.internet.email()

      await authService.register(registerUser)
      const getAuthByEmail = async () => await authService.getAuthByEmail(email)

      await expect(getAuthByEmail).rejects.toThrowError(HttpException)
    })
  })
})
