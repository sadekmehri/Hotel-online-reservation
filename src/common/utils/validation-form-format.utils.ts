import { BadRequestException } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { LooseObject } from '../types'

/* Override the default reponse of class-validation */
export const formatValidationFormResponse = (
  validationErrors: ValidationError[] = [],
): BadRequestException => {
  const errObject: LooseObject = {}

  const errResponse = validationErrors.reduce(
    (accumulator, validationError) => {
      const errProperty = validationError.property
      const errConstraints = validationError.constraints
      const errorMessages = Object.keys(errConstraints).map(
        (value) => errConstraints[value],
      )
      accumulator[`${errProperty}`] = errorMessages
      return accumulator
    },
    errObject,
  )

  return new BadRequestException(errResponse)
}
