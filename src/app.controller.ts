import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './auth/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @UseGuards(JwtGuard)
  getProtected(@Request() req) {
    return {
      message: 'This is a protected route',
      user: { pubkey: req.user.pubkey },
    };
  }
}
