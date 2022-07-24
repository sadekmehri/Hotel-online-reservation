import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { isValidDateFormat } from '../utils/date.util'

@ValidatorConstraint({ name: 'Date format validator', async: false })
export class DateFormatValidator implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments): boolean {
    const dateFormat: string = args.constraints[0]
    return isValidDateFormat(date, dateFormat)
  }

  defaultMessage(args: ValidationArguments): string {
    const dateFormat: string = args.constraints[0]
    return `The correspending date doesn\'t respect the format ${dateFormat}`
  }
}
