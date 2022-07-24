import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Swagger } from '../constants'
import { isDevelopment } from './env.config'

export = (app: NestExpressApplication): void => {
  const isDev: boolean = isDevelopment()
  if (!isDev) return

  const options = new DocumentBuilder()
    .setTitle(Swagger.TITLE)
    .setDescription(Swagger.DESCRIPTION)
    .setVersion(Swagger.VERSION)
    .setBasePath(Swagger.BASE_PATH)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(Swagger.BASE_PATH, app, document)
}
