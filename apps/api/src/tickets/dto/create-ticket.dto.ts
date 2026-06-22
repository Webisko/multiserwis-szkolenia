import { IsEnum, IsString, MinLength } from 'class-validator';
import { TicketCategory } from '@prisma/client';

export class CreateTicketDto {
  @IsString()
  @MinLength(3)
  subject: string;

  @IsEnum(TicketCategory)
  category: TicketCategory;

  @IsString()
  @MinLength(5)
  content: string;
}
