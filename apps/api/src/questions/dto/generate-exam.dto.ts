import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class GenerateExamDto {
  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  count?: number;
}
