export const ServerError = {
  NOT_FOUND: {
    errorCode: 'SERVER_NOT_FOUND',
    message: '서버를 찾을 수 없습니다.',
  },
  FORBIDDEN: {
    errorCode: 'SERVER_FORBIDDEN',
    message: '서버 소유자만 접근할 수 있습니다.',
  },
  NOT_MEMBER: {
    errorCode: 'SERVER_NOT_MEMBER',
    message: '서버 멤버만 접근할 수 있습니다.',
  },
} as const;
