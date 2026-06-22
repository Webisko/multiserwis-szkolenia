import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { ProgressModule } from './progress/progress.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    PrismaModule,
    CoursesModule,
    OrdersModule,
    AuthModule,
    AnalyticsModule,
    UsersModule,
    QuestionsModule,
    ProgressModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
