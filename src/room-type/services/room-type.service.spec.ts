import { Test, TestingModule } from '@nestjs/testing'
import { RoomTypeService } from '.'

describe('RoomTypeService', () => {
  let service: RoomTypeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomTypeService],
    }).compile()

    service = module.get<RoomTypeService>(RoomTypeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
