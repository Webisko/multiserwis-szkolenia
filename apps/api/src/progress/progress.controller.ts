import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('progress')
@UseGuards(JwtGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async list(@Req() req: { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    return this.progressService.list(userId ?? '');
  }

  @Post()
  async update(
    @Req() req: { user?: { sub?: string } },
    @Body() body: UpdateProgressDto,
  ) {
    const userId = req.user?.sub;
    return this.progressService.update(userId ?? '', body);
  }
}
