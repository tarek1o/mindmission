export interface BullMQConfigurations {
  queues: {
    resetPasswordQueue: string;
    emailVerificationQueue: string;
    setFirstPasswordQueue: string;
    changeEmailQueue: string;
    passwordChangedQueue: string;
    welcomeQueue: string;
  };
}