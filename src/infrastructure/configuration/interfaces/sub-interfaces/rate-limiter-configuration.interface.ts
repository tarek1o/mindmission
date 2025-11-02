export interface RateLimiterConfiguration {
  default: {
    limit: number;
    ttl: number;
  },
  auth: {
    login: {
      limit: number;
      ttl: number;
    },
    verifySetFirstPasswordToken: {
      limit: number;
      ttl: number;
    },
    forgetPassword: {
      limit: number;
      ttl: number;
    },
    verifyResetPasswordToken: {
      limit: number;
      ttl: number;
    },
  }
}