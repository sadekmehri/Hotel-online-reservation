import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { GetRoomTypeDto } from '../dtos'
import { RoomTypeService } from '../services/room-type.service'

@ApiTags('Room-types')
@Controller('room-types')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  // @desc      Get list of room types records
  // @route     GET /room-types
  // @access    Public

  @Public()
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of room-types records feature' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return list of room-types records',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "There aren't room-types records",
  })
  getRoomTypes(): Promise<GetRoomTypeDto[]> {
    return this.roomTypeService.getRoomTypes()
  }
}
