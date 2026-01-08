import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    const type = context.getType();
    let route = 'TCP-Message';
    let method = 'RPC';
    // Inicializamos como string vacío en lugar de null para evitar el error de tipos
    let userId = ''; 

    if (type === 'http') {
      const request = context.switchToHttp().getRequest();
      route = request.url;
      method = request.method;
      userId = request.user?.id || '';
    } else if (type === 'rpc') {
      const data = context.switchToRpc().getData();
      // Obtenemos el patrón del mensaje (ej: { cmd: 'register' })
      const pattern = context.switchToRpc().getContext().getPattern();
      route = typeof pattern === 'string' ? pattern : JSON.stringify(pattern);
      method = 'TCP';
      userId = data?.id || data?.user?.id || '';
    }

    return next.handle().pipe(
      tap({
        next: () => this.saveLog(route, method, userId, 200, 'Operación exitosa'),
        error: (err) => this.saveLog(route, method, userId, err.status || 500, err.message || 'Error desconocido'),
      }),
    );
  }

  private async saveLog(route: string, method: string, userId: string, statusCode: number, message: string) {
    try {
      // Usamos los nombres de propiedades que TypeScript espera (userId en lugar de user_id)
      const log = this.logRepository.create({
        route: route || 'unknown',
        method: method || 'TCP',
        userId: userId || undefined, // Si está vacío, lo pasamos como undefined
        statusCode: statusCode,
        message: message.substring(0, 255),
      });
      await this.logRepository.save(log);
    } catch (error) {
      // Evitamos que un fallo en el log bloquee la respuesta principal
      console.error('Error silencioso al guardar log:', error.message);
    }
  }
}