import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginAuthDto {
  /* */
  @ApiProperty({
    example: 'my-example@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  /* */
  @ApiProperty({
    example: 'AA!45aaa@custom@password',
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
