import { Controller, Get, Query } from '@nestjs/common';
import { HealthService, HealthStatus } from './health.service';
import { Observable } from 'rxjs';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('check')
  checkHealth(@Query('url') url: string): Observable<HealthStatus> {
    return this.healthService.checkHealth(url);
  }
}
