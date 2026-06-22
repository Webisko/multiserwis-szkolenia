import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsUUID()
  lessonId: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stoppedAt?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  watchTime?: number;
}
