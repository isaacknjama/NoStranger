import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map, timeout } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AxiosError } from 'axios';

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  url: string;
  responseTime: number;
  lastChecked: Date;
  error?: string;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly httpService: HttpService) {}

  checkHealth(url: string): Observable<HealthStatus> {
    const startTime = Date.now();

    return this.httpService.get(url).pipe(
      timeout(5000),
      map(() => ({
        status: 'UP' as const,
        url,
        responseTime: Date.now() - startTime,
        lastChecked: new Date(),
      })),
      catchError((error: AxiosError): Observable<HealthStatus> => {
        const errorMessage = error.message || 'An unknown error occurred';
        this.logger.error(`Health check failed for ${url}:`, errorMessage);

        return of({
          status: 'DOWN' as const,
          url,
          responseTime: Date.now() - startTime,
          lastChecked: new Date(),
          error: errorMessage,
        });
      }),
    );
  }
}
