import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnrollUserDto } from './dto/enroll-user.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'COMPANY_GUARDIAN')
  async list() {
    return this.usersService.list();
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'COMPANY_GUARDIAN')
  async getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER', 'COMPANY_GUARDIAN')
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'COMPANY_GUARDIAN')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER', 'COMPANY_GUARDIAN')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/enroll')
  @Roles('ADMIN', 'MANAGER', 'COMPANY_GUARDIAN')
  async enroll(@Param('id') id: string, @Body() body: EnrollUserDto) {
    return this.usersService.enroll(id, body);
  }
}
