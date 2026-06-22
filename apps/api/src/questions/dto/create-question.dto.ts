import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Difficulty, QuestionType } from '@prisma/client';

class CreateAnswerDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  isCorrect?: boolean;
}

export class CreateQuestionDto {
  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsUUID()
  moduleId?: string;

  @IsString()
  @MinLength(3)
  content: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
