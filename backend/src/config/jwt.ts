export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key',
  accessExpire: process.env.JWT_EXPIRE || '24h',
  refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  cookieExpire: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
} as const;
