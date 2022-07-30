import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { Request, Response } from 'express'
import { DateFormat } from 'src/common/constants/date-format.enum'
import { getCurrentDate } from '../utils/date.util'

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = exception.getStatus()
    const time = getCurrentDate(DateFormat.DATETIME)

    response.status(status).json({
      message: 'You have reached the maximum request limit rate',
      status,
      time,
      path: request.url,
    })
  }
}
