import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('analytics')
@UseGuards(JwtGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'COMPANY_GUARDIAN')
  async getGuardianAnalytics() {
    return this.analyticsService.getGuardianOverview();
  }
}
