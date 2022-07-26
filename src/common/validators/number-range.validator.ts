import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'Number range validator', async: false })
export class NumberRangeValidator implements ValidatorConstraintInterface {
  validate(data: number, args: ValidationArguments): boolean {
    const startRange: number = args.constraints[0]
    const endRange: number = args.constraints[1]
    return data >= startRange && data <= endRange
  }

  defaultMessage(args: ValidationArguments): string {
    const startRange: number = args.constraints[0]
    const endRange: number = args.constraints[1]
    return `The given number should be between ${startRange} and ${endRange}`
  }
}
