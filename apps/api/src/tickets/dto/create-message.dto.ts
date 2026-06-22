import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
