import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.lessonProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  update(userId: string, input: UpdateProgressDto) {
    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: input.lessonId,
        },
      },
      update: {
        completed: input.completed ?? undefined,
        score: input.score ?? undefined,
        stoppedAt: input.stoppedAt ?? undefined,
        watchTime: input.watchTime ? { increment: input.watchTime } : undefined,
      },
      create: {
        userId,
        lessonId: input.lessonId,
        completed: input.completed ?? false,
        score: input.score ?? undefined,
        stoppedAt: input.stoppedAt ?? 0,
        watchTime: input.watchTime ?? 0,
      },
    });
  }
}
