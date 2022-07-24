import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Jwt } from 'src/common/constants'
import { Partial, UserModel } from 'src/common/models'
import { compareHashToText, hash } from 'src/common/utils/bcrypt.util'
import { parseStringToDate } from 'src/common/utils/date.util'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetUserDto, LoginAuthDto, RegisterAuthDto } from '../dtos'
import { JwtPayload, Tokens } from '../types'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /* Register new user */
  async register(
    registerAuthDto: RegisterAuthDto,
  ): Promise<Partial<UserModel>> {
    const { email, cin, dob, password } = registerAuthDto

    // Check if the user's cin number exists or not
    const isUserExistByCin = await this.prismaService.users.findUnique({
      where: {
        cin,
      },
      select: {
        cin: true,
      },
    })

    if (isUserExistByCin)
      throw new HttpException(
        { message: `The cin number was already taken!` },
        HttpStatus.BAD_REQUEST,
      )

    // Check if the user's mail address exists or not
    const isUserExistByEmail = await this.prismaService.users.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
      },
    })

    if (isUserExistByEmail)
      throw new HttpException(
        { message: `The mail address was already taken!` },
        HttpStatus.BAD_REQUEST,
      )

    // Hash the password
    const hashedPassword: string = await hash(password)

    // Save user to database
    const newUser = await this.prismaService.users.create({
      data: {
        ...registerAuthDto,
        password: hashedPassword,
        dob: parseStringToDate(dob),
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        dob: true,
      },
    })

    return newUser
  }

  /* Registered users tries to login  */
  async login(loginAuthDto: LoginAuthDto): Promise<Tokens> {
    const { email, password } = loginAuthDto

    // Check if the user's mail address exists or not
    const user = await this.prismaService.users.findMany({
      where: {
        email,
      },
      select: {
        userId: true,
        email: true,
        password: true,
      },
    })

    if (user.length !== 1)
      throw new HttpException(
        { message: `Email or password is incorrect!` },
        HttpStatus.BAD_REQUEST,
      )

    const { userId, email: userEmail, password: hashedPassword } = user[0]

    // Check if the stored password matches with the given password
    const isPasswordMatching: boolean = await compareHashToText(
      password,
      hashedPassword,
    )

    if (!isPasswordMatching)
      throw new HttpException(
        { message: `Email or password is incorrect!` },
        HttpStatus.BAD_REQUEST,
      )

    // Get generated tokens
    const tokens = await this.generateTokens(userId, userEmail)

    // Save refresh token to database
    await this.updateRefreshToken(userId, tokens.refreshToken)

    return tokens
  }

  /* Refresh jwt access token for authenticated user */
  async refreshToken(userId: number, refreshToken: string): Promise<Tokens> {
    // Check if the user exist with the given payload
    const user = await this.prismaService.users.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        email: true,
        refreshToken: true,
      },
    })

    // Check for the existance of refresh token for the registred user
    if (!user || !user.refreshToken)
      throw new HttpException(
        { message: `Access denied!` },
        HttpStatus.FORBIDDEN,
      )

    // Check if the stored refreshToken matches with the given refreshToken
    const isRefreshTokenMatching: boolean = await compareHashToText(
      refreshToken,
      user.refreshToken,
    )

    if (!isRefreshTokenMatching)
      throw new HttpException(
        { message: `Access denied!` },
        HttpStatus.FORBIDDEN,
      )

    const { userId: id, email } = user

    // Get generated tokens
    const tokens = await this.generateTokens(id, email)

    // Save refresh token to database
    await this.updateRefreshToken(id, tokens.refreshToken)

    return tokens
  }

  /* Get auth user details */
  async getAuthInfo(userId: number): Promise<GetUserDto> {
    return await this.prismaService.users.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        dob: true,
      },
    })
  }

  /* Authenticated user tries to logout */
  async logout(userId: number): Promise<void> {
    await this.prismaService.users.updateMany({
      where: {
        userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    })
  }

  /* Generate access token and refresh token */
  private async generateTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(userId, email),
      this.signRefreshToken(userId, email),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  /* Sign for access token */
  private signAccessToken(userId: number, email: string): Promise<string> {
    const jwtPayload: JwtPayload = {
      userId: userId,
      email: email,
    }

    return this.jwtService.signAsync(jwtPayload, {
      secret: Jwt.ACCESS_TOKEN_SECRET,
      expiresIn: Jwt.EXPIRES_IN_ACCESS_TOKEN,
    })
  }

  /* Sign for refresh token */
  private signRefreshToken(userId: number, email: string): Promise<string> {
    const jwtPayload: JwtPayload = {
      userId: userId,
      email: email,
    }

    return this.jwtService.signAsync(jwtPayload, {
      secret: Jwt.REFRESH_TOKEN_SECRET,
      expiresIn: Jwt.EXPIRES_IN_REFRESH_TOKEN,
    })
  }

  /* Update refresh token field after user registration */
  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken: string = await hash(refreshToken)
    await this.prismaService.users.update({
      where: {
        userId,
      },
      data: {
        refreshToken: hashedToken,
      },
    })
  }
}
