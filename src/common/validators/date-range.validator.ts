import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { isDateBetween } from '../utils/date.util'

@ValidatorConstraint({ name: 'Date range validator', async: false })
export class DateRangeValidator implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments): boolean {
    const startDate: string = args.constraints[0]
    const endDate: string = args.constraints[1]
    return isDateBetween(date, startDate, endDate)
  }

  defaultMessage(args: ValidationArguments): string {
    const startDate: string = args.constraints[0]
    const endDate: string = args.constraints[1]
    return `The given date should be between ${startDate} and ${endDate}`
  }
}
