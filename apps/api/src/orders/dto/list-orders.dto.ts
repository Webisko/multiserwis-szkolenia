import { IsOptional, IsUUID } from 'class-validator';

export class ListOrdersDto {
  @IsOptional()
  @IsUUID()
  userId?: string;
}
