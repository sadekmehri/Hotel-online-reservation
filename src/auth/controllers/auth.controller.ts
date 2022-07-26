import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { GetCurrentAuth, GetCurrentAuthId, Public } from 'src/common/decorators'
import { RefreshTokenGuard } from 'src/common/guards'
import { TransformInterceptor } from 'src/common/interceptors'
import { GetUserDto, LoginAuthDto, RegisterAuthDto } from '../dtos'
import { AuthService } from '../services'
import { Tokens } from '../types'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @desc      Register
  // @route     POST /auth/register
  // @access    Public

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new TransformInterceptor(GetUserDto))
  @ApiOperation({ summary: 'Register feature' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetUserDto,
    description: 'A user has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Form validation errors',
  })
  register(@Body() registerAuthDto: RegisterAuthDto): Promise<GetUserDto> {
    return this.authService.register(registerAuthDto)
  }

  // @desc      Login
  // @route     POST /auth/login
  // @access    Public

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login feature' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A user has been successfully logged in',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Form validation errors',
  })
  login(@Body() loginAuthDto: LoginAuthDto): Promise<Tokens> {
    return this.authService.login(loginAuthDto)
  }

  // @desc      Refresh token
  // @route     POST /auth/refresh
  // @access    Private

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token feature' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token has successfully been refreshed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No token provided',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user has logged out and then call the refresh token',
  })
  refreshToken(
    @GetCurrentAuthId() userId: number,
    @GetCurrentAuth('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshToken(userId, refreshToken)
  }

  // @desc      Get auth information
  // @route     POST /auth/me
  // @access    Private

  @Post('/me')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new TransformInterceptor(GetUserDto))
  @ApiOperation({ summary: 'Get auth details feature' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Auth details',
    type: GetUserDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  getAuthInfo(@GetCurrentAuthId() userId: number): Promise<GetUserDto> {
    return this.authService.getAuthInfo(userId)
  }

  // @desc      Logout
  // @route     POST /auth/logout
  // @access    Private

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout feature' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged-in user has successfully logout',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  logout(@GetCurrentAuthId() userId: number): Promise<void> {
    return this.authService.logout(userId)
  }
}
