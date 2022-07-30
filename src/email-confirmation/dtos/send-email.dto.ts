import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SendEmailDto {
  @ApiProperty({
    example: 'my-example@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string
}
