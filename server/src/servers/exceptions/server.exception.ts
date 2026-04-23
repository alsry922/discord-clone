import { BaseException } from '../../common/exceptions/base.exception';
import { ServerError } from '../constants/server-error-code';
import { HttpStatus } from '@nestjs/common';

export class ServerException extends BaseException {
  static notFound() {
    return new ServerException(ServerError.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  static notMember() {
    return new ServerException(ServerError.NOT_MEMBER, HttpStatus.FORBIDDEN);
  }

  static forbidden() {
    return new ServerException(ServerError.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}
