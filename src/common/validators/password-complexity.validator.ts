import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'Password complexity validator', async: false })
export class PasswordComplexityValidator
  implements ValidatorConstraintInterface
{
  validate(password: string, args: ValidationArguments): boolean {
    const pattern: RegExp = args.constraints[0]
    return pattern.test(password)
  }

  defaultMessage(_args: ValidationArguments): string {
    return `The password must contain one or more uppercase characters, 
    one or more lowercase characters, one or more numeric values and
    one or more special characters!`
  }
}
