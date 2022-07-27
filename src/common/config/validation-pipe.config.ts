import { ValidationError } from '@nestjs/common'
import { formatValidationFormResponse } from '../utils/validation-form-format.utils'

export const validationPipeOptions = {
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  exceptionFactory: (validationErrors: ValidationError[] = []) =>
    formatValidationFormResponse(validationErrors),
}
