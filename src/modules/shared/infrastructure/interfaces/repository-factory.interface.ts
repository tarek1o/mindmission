import { EntityManager } from 'typeorm';
import { LoggerService } from '@nestjs/common';

export interface IRepositoryFactory<T> {
  create(manager: EntityManager, logger: LoggerService): T;
}
