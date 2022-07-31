import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { DateMeasure, RateLimit, Role } from 'src/common/constants'
import { GetCurrentAuthId, Public, Roles } from 'src/common/decorators'
import { SendEmailDto } from '../dtos'
import { EmailConfirmationService } from '../services/email-confirmation.service'

@Throttle(RateLimit.EMAIL, DateMeasure.DAY)
@ApiTags('Account')
@Controller('account')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  // @desc      Send confirmation link
  // @route     POST /account/send-confirmation-link
  // @access    Public

  @Public()
  @Post('send-confirmation-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send verification link feature' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification link was successfully sent',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email - account is verified',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'You have reached the maximum request limit rate',
  })
  @ApiResponse({
    status: HttpStatus.MISDIRECTED,
    description: 'Unable to send mail',
  })
  async send(@Body() sendEmailDto: SendEmailDto): Promise<void> {
    const { email } = sendEmailDto
    await this.emailConfirmationService.sendConfirmationProcess(email)
  }

  // @desc      Verify account
  // @route     POST /account/confirm?token={}
  // @access    Public

  @Public()
  @Get('confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Confirm verification link feature' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Account is successfully verified',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email - account is verified - Invalid token',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'You have reached the maximum request limit rate',
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'Unable to send mail due to its configuration',
  })
  async confirm(@Query('token') token: string): Promise<void> {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
    )
    await this.emailConfirmationService.confirmEmail(email)
  }

  // @desc      Resend confirmation link
  // @route     POST /account/resend-confirmation-link
  // @access    Private
  // @role      User

  @Post('resend-confirmation-link')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification link feature' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'You have reached the maximum request limit rate',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Form validation errors',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized action',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User role doesn't match the requirements",
  })
  async resend(@GetCurrentAuthId() userId: number): Promise<void> {
    await this.emailConfirmationService.resendConfirmationLink(userId)
  }
}
