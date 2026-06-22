import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnrollUserDto } from './dto/enroll-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private mapUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? '',
      role: user.role,
      enrollments: Array.isArray(user.enrollments)
        ? user.enrollments.map((enr: any) => ({
            id: enr.id,
            courseId: enr.courseId,
            progress: enr.progress ?? 0,
            active: enr.status === 'ACTIVE',
            expiresAt: null,
          }))
        : [],
    };
  }

  async list() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { enrollments: true },
    });
    return users.map((user) => this.mapUser(user));
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { enrollments: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapUser(user);
  }

  async create(input: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        phone: input.phone,
        passwordHash,
        role: input.role ?? UserRole.STUDENT,
      },
      include: { enrollments: true },
    });

    return this.mapUser(user);
  }

  async update(id: string, input: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (input.email && input.email !== existing.email) {
      const emailOwner = await this.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (emailOwner) {
        throw new BadRequestException('Email already exists');
      }
    }

    const data: any = {
      email: input.email ?? undefined,
      name: input.name ?? undefined,
      phone: input.phone ?? undefined,
      role: input.role ?? undefined,
    };

    if (input.password) {
      data.passwordHash = await bcrypt.hash(input.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: { enrollments: true },
    });

    return this.mapUser(user);
  }

  async remove(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  async enroll(userId: string, input: EnrollUserDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: input.courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: input.courseId } },
    });

    if (existing) {
      return {
        ...existing,
        active: existing.status === 'ACTIVE',
        expiresAt: null,
      };
    }

    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId,
        courseId: input.courseId,
        status: 'ACTIVE',
        progress: 0,
      },
    });

    return {
      ...enrollment,
      active: true,
      expiresAt: null,
    };
  }
}
