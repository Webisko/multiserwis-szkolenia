import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GenerateExamDto } from './dto/generate-exam.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('questions')
@UseGuards(JwtGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  list(
    @Query('courseId') courseId?: string,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.questionsService.list(courseId, moduleId);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  create(@Body() body: CreateQuestionDto) {
    return this.questionsService.create(body);
  }

  @Post('generate')
  generate(@Body() body: GenerateExamDto) {
    return this.questionsService.generateExam(body.courseId, body.count ?? 10);
  }
}
