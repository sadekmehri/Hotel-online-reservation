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
import { ActiveAccountGuard, RefreshTokenGuard } from 'src/common/guards'
import { TransformInterceptor } from 'src/common/interceptors'
import { GetUserDto, LoginAuthDto, RegisterAuthDto } from '../dtos'
import { AuthService } from '../services/auth.service'
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
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'You have reached the maximum request limit rate',
  })
  register(@Body() registerAuthDto: RegisterAuthDto): Promise<GetUserDto> {
    return this.authService.register(registerAuthDto)
  }

  // @desc      Login
  // @route     POST /auth/login
  // @access    Public

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ summary: 'Login feature' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A user has been successfully logged in',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Form validation errors',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Account blocked',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'You have reached the maximum request limit rate',
  })
  login(@Body() loginAuthDto: LoginAuthDto): Promise<Tokens> {
    return this.authService.login(loginAuthDto)
  }

  // @desc      Refresh token
  // @route     POST /auth/refresh
  // @access    Private

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(RefreshTokenGuard)
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
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'You have reached the maximum request limit rate',
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
  @UseGuards(ActiveAccountGuard)
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
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'You have reached the maximum request limit rate',
  })
  getAuthInfo(@GetCurrentAuthId() userId: number): Promise<GetUserDto> {
    return this.authService.getAuthInfo(userId)
  }

  // @desc      Logout
  // @route     POST /auth/logout
  // @access    Private

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ActiveAccountGuard)
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
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'You have reached the maximum request limit rate',
  })
  logout(@GetCurrentAuthId() userId: number): Promise<void> {
    return this.authService.logout(userId)
  }
}
