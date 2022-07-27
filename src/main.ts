import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { corsOptions } from './common/config/cors.config'
import { validationPipeOptions } from './common/config/validation-pipe.config'

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule)
  const config: ConfigService = app.get(ConfigService)
  const port: number = config.get<number>('APP_PORT')

  app.disable('x-powered-by')
  app.enableCors(corsOptions)
  app.setGlobalPrefix('api/v1/')
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions))

  require('./common/config/key.config')()
  require('./common/config/swagger.config')(app)

  await app.listen(port)
}

bootstrap()
