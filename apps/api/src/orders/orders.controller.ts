import {
  Body,
  Controller,
  Patch,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersDto } from './dto/list-orders.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @Get()
  async list(
    @Query() query: ListOrdersDto,
    @Req() req: { user?: { sub?: string; role?: string } },
  ) {
    const role = req.user?.role ?? 'STUDENT';
    const isPrivileged = role === 'ADMIN' || role === 'MANAGER';

    if (query.userId && !isPrivileged) {
      throw new ForbiddenException('Insufficient permissions.');
    }

    const effectiveUserId = isPrivileged ? query.userId : req.user?.sub;
    return this.ordersService.list(effectiveUserId);
  }

  @Get('me')
  async listMine(@Req() req: { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    return this.ordersService.list(userId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const order = await this.ordersService.getById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Patch(':id/status')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    const updated = await this.ordersService.updateStatus(id, body);
    if (!updated) {
      throw new NotFoundException('Order not found');
    }
    return updated;
  }
}
