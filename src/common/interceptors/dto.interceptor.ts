import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

interface ClassType<T> {
  new (): T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Partial<T>, T> {
  constructor(private readonly classType: ClassType<T>) {}

  intercept(
    _context: ExecutionContext,
    call$: CallHandler<Partial<T>>,
  ): Observable<T> {
    return call$
      .handle()
      .pipe(map((data) => plainToClass(this.classType, data)))
  }
}
