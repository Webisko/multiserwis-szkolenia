import { IsUUID } from 'class-validator';

export class EnrollUserDto {
  @IsUUID()
  courseId: string;
}
