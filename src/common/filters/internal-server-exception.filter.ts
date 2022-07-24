import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { getCurrentDate } from '../utils/date.util'
import { DateFormat } from 'src/common/constants/date.enum'

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = exception.getStatus()
    const time = getCurrentDate(DateFormat.DATETIME)

    response.status(status).json({
      message: 'Something wrong happened',
      status,
      time,
      path: request.url,
    })
  }
}
