import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLog } from '../database/api-log.entity';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(ApiLog)
    private readonly logRepository: Repository<ApiLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, url, user } = request;

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.saveLog(url, method, user?.userId, response.statusCode, 'Operación exitosa');
        },
        error: (err) => {
          this.saveLog(url, method, user?.userId, err.status || 500, err.message);
        },
      }),
    );
  }

  private async saveLog(
    route: string,
    method: string,
    userId: string,
    statusCode: number,
    message: string,
  ) {
    // Guarda directamente en la tabla api_logs
    const log = this.logRepository.create({
      route,
      method,
      userId: userId || undefined,
      statusCode,
      message: message.substring(0, 500), // Evita textos demasiado largos
    });
    await this.logRepository.save(log);
  }
}
