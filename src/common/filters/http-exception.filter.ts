import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { getCurrentDate } from '../utils/date.util'
import { DateFormat } from 'src/common/constants/date.enum'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = exception.getStatus()
    const exMessage = exception.getResponse()
    const time = getCurrentDate(DateFormat.DATETIME)

    response.status(status).json({
      message: exMessage['message'] ?? exMessage,
      status,
      time,
      path: request.url,
    })
  }
}
