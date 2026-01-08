import { Catch, RpcExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Si la excepción ya es de tipo HTTP (ocurrió en el Gateway)
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    }

    // Extraemos el mensaje de error del microservicio
    // Los errores de NestJS Microservices suelen venir en la propiedad 'message' o ser el objeto mismo
    const errorResponse = exception.getError ? exception.getError() : exception;

    const status = errorResponse?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = errorResponse?.message || errorResponse || 'Internal server error';

    // Enviamos la respuesta formateada al cliente (Postman)
    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}