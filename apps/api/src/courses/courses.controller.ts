import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async list() {
    return this.coursesService.list();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const course = await this.coursesService.getById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async create(@Body() body: CreateCourseDto) {
    return this.coursesService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async update(@Param('id') id: string, @Body() body: UpdateCourseDto) {
    const course = await this.coursesService.update(id, body);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async remove(@Param('id') id: string) {
    const removed = await this.coursesService.remove(id);
    if (!removed) {
      throw new NotFoundException('Course not found');
    }
    return { success: true };
  }
}
