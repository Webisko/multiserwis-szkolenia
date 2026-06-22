import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@Req() req: { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user = await this.authService.getMe(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
