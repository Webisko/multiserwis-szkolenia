import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

type QuestionWithAnswers = Prisma.QuestionGetPayload<{
  include: { answers: true };
}>;

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  list(courseId?: string, moduleId?: string): Promise<QuestionWithAnswers[]> {
    if (!courseId) {
      throw new BadRequestException('Missing courseId');
    }

    return this.prisma.question.findMany({
      where: {
        courseId,
        moduleId: moduleId || undefined,
      },
      include: {
        answers: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: CreateQuestionDto): Promise<QuestionWithAnswers> {
    const course = await this.prisma.course.findUnique({
      where: { id: input.courseId },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    return this.prisma.question.create({
      data: {
        courseId: input.courseId,
        moduleId: input.moduleId,
        content: input.content,
        type: input.type,
        difficulty: input.difficulty ?? 'MEDIUM',
        answers: {
          create: input.answers.map((answer) => ({
            content: answer.content,
            isCorrect: answer.isCorrect,
            explanation: answer.explanation,
          })),
        },
      },
      include: { answers: true },
    });
  }

  async generateExam(
    courseId: string,
    count: number,
  ): Promise<QuestionWithAnswers[]> {
    if (!courseId) {
      throw new BadRequestException('Missing courseId');
    }

    const questions = await this.prisma.question.findMany({
      where: { courseId },
      include: { answers: true },
    });

    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.max(1, count));
  }
}
