import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.course.findMany({
      orderBy: { title: 'asc' },
    });
  }

  async getById(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  async create(input: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: input.title,
        category: input.category,
        duration: input.duration,
        price: input.price,
        promoPrice: input.promoPrice,
        image: input.image,
        isPopular: input.isPopular ?? false,
        description: input.description,
        status: input.status ?? 'published',
      },
    });
  }

  async update(id: string, input: UpdateCourseDto) {
    const exists = await this.prisma.course.findUnique({ where: { id } });
    if (!exists) {
      return null;
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        title: input.title ?? undefined,
        category: input.category ?? undefined,
        duration: input.duration ?? undefined,
        price: input.price ?? undefined,
        promoPrice: input.promoPrice ?? undefined,
        image: input.image ?? undefined,
        isPopular: input.isPopular ?? undefined,
        description: input.description ?? undefined,
        status: input.status ?? undefined,
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.course.findUnique({ where: { id } });
    if (!exists) {
      return null;
    }

    await this.prisma.course.delete({ where: { id } });
    return true;
  }
}
