import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BaseException } from '../exceptions/base.exception';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const errorStatus = exception.getStatus();
    const path = request.path;
    const timestamp = new Date().toISOString();
    if (exception instanceof BaseException) {
      const { errorCode, message } = exception.getResponse();
      const errorResponseBody: ErrorResponse = {
        errorCode,
        message,
        statusCode: errorStatus,
        path,
        timestamp,
      };
      response.status(errorStatus).json(errorResponseBody);
      return;
    }
    const message = exception.message;
    const errorResponseBody: ErrorResponse = {
      errorCode: 'HTTP_EXCEPTION',
      message,
      statusCode: errorStatus,
      path,
      timestamp,
    };
    response.status(errorStatus).json(errorResponseBody);
  }
}
