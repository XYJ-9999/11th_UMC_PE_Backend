import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'COMMON500';
    let message: string | string[] = '서버 내부 오류가 발생했습니다.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as any;
      message = typeof body === 'string' ? body : (body.message ?? exception.message);
      code = body.code ?? `COMMON${status}`;
    } else if (exception instanceof QueryFailedError) {
      const driverError = (exception as any).driverError;
      if (driverError?.code === 'ER_DUP_ENTRY') {
        status = HttpStatus.CONFLICT;
        code = 'COMMON409';
        message = '이미 등록된 데이터입니다.';
      }
    }

    response.status(status).json({
      isSuccess: false,
      code,
      message: Array.isArray(message) ? message[0] : message,
      result: null,
    });
  }
}
