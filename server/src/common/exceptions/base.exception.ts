import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    private readonly errorBody: { errorCode: string; message: string },
    statusCode: HttpStatus,
  ) {
    super(errorBody, statusCode);
  }

  getResponse(): { errorCode: string; message: string } {
    return this.errorBody;
  }
}
