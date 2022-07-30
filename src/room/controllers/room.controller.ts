import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { TransformInterceptor } from 'src/common/interceptors/dto.interceptor'
import { IPaginateResponse, PaginateRequest } from 'src/common/types'
import { CreateRoomDto, GetRoomDto } from '../dtos'
import { RoomService } from '../services/room.service'

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // @desc      Get list of rooms
  // @route     GET /rooms?page={}&limit={}
  // @access    Public

  @Public()
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of rooms feature' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list of room data after pagination process',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There is no data after pagination process',
  })
  getRooms(
    @Query() props: PaginateRequest,
  ): Promise<IPaginateResponse<GetRoomDto>> {
    return this.roomService.getRooms(props)
  }

  // @desc      Create new room
  // @route     Post /rooms/
  // @access    Public

  @Public()
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new TransformInterceptor(GetRoomDto))
  @ApiOperation({ summary: 'Create room feature' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new room',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Form validation errors',
  })
  createRoom(@Body() createRoomDto: CreateRoomDto): Promise<GetRoomDto> {
    return this.roomService.createRoom(createRoomDto)
  }
}
