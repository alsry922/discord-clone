export const ChannelError = {
  NOT_FOUND: {
    errorCode: 'CHANNEL_NOT_FOUND',
    message: '채널을 찾을 수 없습니다.',
  },
  FORBIDDEN: {
    errorCode: 'CHANNEL_FORBIDDEN',
    message: '채널에 접근할 수 없습니다.',
  },
} as const;
