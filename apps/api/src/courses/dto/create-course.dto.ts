import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  category: string;

  @IsString()
  duration: string;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  promoPrice?: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
