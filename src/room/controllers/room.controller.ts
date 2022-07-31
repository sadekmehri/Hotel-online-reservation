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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Role } from 'src/common/constants'
import { Public, Roles } from 'src/common/decorators'
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
  // @access    Private
  // @role      Admin

  @Post('/')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized action',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "User role doesn't match the requirements",
  })
  createRoom(@Body() createRoomDto: CreateRoomDto): Promise<GetRoomDto> {
    return this.roomService.createRoom(createRoomDto)
  }
}
