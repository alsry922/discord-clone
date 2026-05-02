import { BaseException } from '../../common/exceptions/base.exception';
import { AuthError } from '../constants/auth-error-code.constant';
import { HttpStatus } from '@nestjs/common';

export class AuthException extends BaseException {
  static conflict() {
    return new AuthException(AuthError.CONFLICT, HttpStatus.CONFLICT);
  }

  static invalidCredentials() {
    return new AuthException(
      AuthError.INVALID_CREDENTIALS,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
