import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGuardianOverview() {
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const employees = students.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      totalWatchTime: 0,
      completedCourses: 0,
      activeCourses: 0,
      passedTests: 0,
      lastLogin: null,
    }));

    return {
      overview: {
        totalEmployees: employees.length,
        activeNow: 0,
        totalWatchHours: 0,
      },
      employees,
    };
  }
}
