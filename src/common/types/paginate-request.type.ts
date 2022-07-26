import { IsInt, IsOptional } from 'class-validator'

export class PaginateRequest {
  @IsOptional()
  @IsInt()
  page?: number

  @IsOptional()
  @IsInt()
  limit?: number
}
