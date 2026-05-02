export const AuthError = {
  CONFLICT: {
    errorCode: 'AUTH_EMAIL_CONFLICT',
    message: '이미 사용 중인 이메일입니다.',
  },
  INVALID_CREDENTIALS: {
    errorCode: 'AUTH_INVALID_CREDENTIALS',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
} as const;
