import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { getCurrentDate } from '../utils/date.util'
import { DateFormat } from 'src/common/constants/date-format.enum'

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const request = context.getRequest<Request>()
    const status = exception.getStatus()
    const time = getCurrentDate(DateFormat.DATETIME)

    response.status(status).json({
      message: 'Resource not found',
      status,
      time,
      path: request.url,
    })
  }
}
