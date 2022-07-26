import { ApiProperty } from '@nestjs/swagger'
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator'
import { RoomPrice } from 'src/common/constants'
import { NumberRangeValidator } from 'src/common/validators'

export class CreateRoomDto {
  @ApiProperty({
    description: 'Provide a unique room code',
    example: 'Room-10',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5, {
    message:
      'Room code is too short. Minimal length is $constraint1 characters',
  })
  @MaxLength(30, {
    message: 'Room code is too long. Maximal length is $constraint1 characters',
  })
  code: string

  /* */
  @ApiProperty({
    description: `You should multiply the current price * 100. 
      Example the current price 12$ so you should write 1200`,
    example: RoomPrice.MIN_PRICE,
  })
  @IsNotEmpty()
  @IsInt({
    message: 'Room price should be integer',
  })
  @Validate(NumberRangeValidator, [RoomPrice.MIN_PRICE, RoomPrice.MAX_PRICE])
  price: number

  /* */
  @ApiProperty({
    description: 'Attach Room-type id to the an exisitng room',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt({
    message: 'Room type should be integer',
  })
  roomTypeId: number
}
