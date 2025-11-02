import { BaseDomainError } from './base/base-domain.error';

export class ProtectedResourceError extends BaseDomainError {
  constructor(message: string, public readonly args?: Record<string, any>) {
    super(message);
  }
}
