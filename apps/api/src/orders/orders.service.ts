import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateOrderDto) {
    if (!input.userId || !input.courseId || !Number.isFinite(input.amount)) {
      throw new BadRequestException('Missing required order fields.');
    }

    return this.prisma.order.create({
      data: {
        userId: input.userId,
        courseId: input.courseId,
        amount: Math.round(input.amount),
        provider: input.provider,
        status: OrderStatus.PENDING_PAYMENT,
      },
    });
  }

  async getById(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async list(userId?: string) {
    return this.prisma.order.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, input: UpdateOrderStatusDto) {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: input.status },
    });
  }
}
