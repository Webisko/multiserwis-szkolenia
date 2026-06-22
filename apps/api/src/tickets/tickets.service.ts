import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, isPrivileged: boolean) {
    return this.prisma.ticket.findMany({
      where: isPrivileged ? undefined : { userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getById(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  create(userId: string, input: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        userId,
        subject: input.subject,
        category: input.category,
        messages: {
          create: {
            senderId: userId,
            content: input.content,
            isInternal: false,
          },
        },
      },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async addMessage(
    ticketId: string,
    senderId: string,
    input: CreateMessageDto,
  ) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const message = await this.prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId,
        content: input.content,
        isInternal: input.isInternal ?? false,
      },
    });

    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async updateStatus(ticketId: string, input: UpdateTicketStatusDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (!input.status) {
      throw new BadRequestException('Missing status');
    }

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: input.status },
    });
  }
}
