import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tickets')
@UseGuards(JwtGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  list(@Req() req: { user?: { sub?: string; role?: string } }) {
    const role = req.user?.role ?? 'STUDENT';
    const isPrivileged = role === 'ADMIN' || role === 'MANAGER';
    return this.ticketsService.list(req.user?.sub ?? '', isPrivileged);
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Req() req: { user?: { sub?: string; role?: string } },
  ) {
    const ticket = await this.ticketsService.getById(id);
    const role = req.user?.role ?? 'STUDENT';
    const isPrivileged = role === 'ADMIN' || role === 'MANAGER';

    if (!isPrivileged && ticket.userId !== req.user?.sub) {
      throw new ForbiddenException('Forbidden');
    }

    if (!isPrivileged) {
      return {
        ...ticket,
        messages: (ticket.messages || []).filter((m) => !m.isInternal),
      };
    }

    return ticket;
  }

  @Post()
  create(
    @Req() req: { user?: { sub?: string } },
    @Body() body: CreateTicketDto,
  ) {
    return this.ticketsService.create(req.user?.sub ?? '', body);
  }

  @Post(':id/messages')
  async addMessage(
    @Param('id') id: string,
    @Req() req: { user?: { sub?: string; role?: string } },
    @Body() body: CreateMessageDto,
  ) {
    const role = req.user?.role ?? 'STUDENT';
    const isPrivileged = role === 'ADMIN' || role === 'MANAGER';
    const ticket = await this.ticketsService.getById(id);
    if (!isPrivileged && ticket.userId !== req.user?.sub) {
      throw new ForbiddenException('Forbidden');
    }
    if (!isPrivileged && body.isInternal) {
      body.isInternal = false;
    }
    return this.ticketsService.addMessage(id, req.user?.sub ?? '', body);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'MANAGER')
  updateStatus(@Param('id') id: string, @Body() body: UpdateTicketStatusDto) {
    return this.ticketsService.updateStatus(id, body);
  }
}
