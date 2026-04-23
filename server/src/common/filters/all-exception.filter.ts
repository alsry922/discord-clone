import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const path = request.path;
    const errorResponseBody: ErrorResponse = {
      errorCode: 'INTERNAL_SERVER_ERROR',
      statusCode: errorStatus,
      message: '서버 오류가 발생했습니다.',
      path,
      timestamp: new Date().toISOString(),
    };
    response.status(errorStatus).json(errorResponseBody);
  }
}
