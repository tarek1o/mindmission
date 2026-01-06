import { BaseDomainError } from 'src/modules/shared/domain/errors/base/base-domain.error';

export interface ErrorMappingResult {
  constraint: string;
  error: BaseDomainError;
}
