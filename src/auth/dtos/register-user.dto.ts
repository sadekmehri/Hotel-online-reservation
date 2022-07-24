import { ApiProperty } from '@nestjs/swagger'
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator'
import { DateFormat, PasswordComplexity } from 'src/common/constants'
import {
  DateFormatValidator,
  DateRangeValidator,
  PasswordComplexityValidator,
} from 'src/common/validators'
import { sustractDateByYear } from 'src/common/utils/date.util'

export class RegisterAuthDto {
  /* */
  @ApiProperty({
    description: 'Has to match a regular expression: /^[a-zA-Z]{3,15}$/',
    example: 'Jhon',
  })
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(3, {
    message:
      'First name is too short. Minimal length is $constraint1 characters',
  })
  @MaxLength(15, {
    message:
      'First name is too long. Maximal length is $constraint1 characters',
  })
  firstName: string

  /* */
  @ApiProperty({
    description: 'Has to match a regular expression: /^[a-zA-Z]{3,15}$/',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(3, {
    message:
      'Last name is too short. Minimal length is $constraint1 characters',
  })
  @MaxLength(15, {
    message: 'Last name is too long. Maximal length is $constraint1 characters',
  })
  lastName: string

  /* */
  @ApiProperty({
    example: 'my-example@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  /* */
  @ApiProperty({
    description: 'Has to match a regular expression: /^[0-9]{8,10}$/',
    example: '00000000',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Cin is too short. Minimal length is $constraint1 characters',
  })
  @MaxLength(10, {
    message: 'Cin is too long. Maximal length is $constraint1 characters',
  })
  cin: string

  /* */
  @ApiProperty({
    description: `Has to match this particular date format ${DateFormat.DATE}`,
    example: '1998-10-10',
  })
  @IsNotEmpty()
  @Validate(DateFormatValidator, [DateFormat.DATE])
  @Validate(DateRangeValidator, [
    sustractDateByYear(120),
    sustractDateByYear(18),
  ])
  dob: string

  /* */
  @ApiProperty({
    description: `The password must contain one or more uppercase characters, 
    one or more lowercase characters, one or more numeric values and
    one or more special characters!`,
    example: 'AA!45aaa@custom@password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password is too short. Minimal length is $constraint1 characters',
  })
  @MaxLength(40, {
    message: 'Password is too long. Maximal length is $constraint1 characters',
  })
  @Validate(PasswordComplexityValidator, [
    new RegExp(PasswordComplexity.PATTERN),
  ])
  password: string
}
