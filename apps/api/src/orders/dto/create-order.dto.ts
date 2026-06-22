import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  provider?: string;
}
