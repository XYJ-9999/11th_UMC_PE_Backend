import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiException } from '../exceptions/api.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'COMMON500';
    let message = '서버 내부 오류가 발생했습니다.';

    if (exception instanceof ApiException) {
      status = exception.getStatus();
      code = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      const rawMessage =
        typeof body === 'string'
          ? body
          : (body as { message?: string | string[] }).message;
      message = Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : rawMessage ?? exception.message;

      if (status === HttpStatus.UNAUTHORIZED) code = 'AUTH401_2';
      else if (status === HttpStatus.FORBIDDEN) code = 'FORBIDDEN_ACCESS';
      else code = `COMMON${status}`;
    }

    response.status(status).json({
      isSuccess: false,
      code,
      message,
      result: null,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
