import { BaseException } from '../../common/exceptions/base.exception';
import { ChannelError } from '../constants/channel-error-code';
import { HttpStatus } from '@nestjs/common';

export class ChannelException extends BaseException {
  static notFound() {
    return new ChannelException(ChannelError.NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  static forbidden() {
    return new ChannelException(ChannelError.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}
