import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuspendedAccountEntity } from './infrastructure/database/entities/suspended-account.entity';
import { SuspendedAccountRepository } from './infrastructure/database/repositories/suspended-account.repository';
import { SUSPENDED_ACCOUNT_REPOSITORY } from './application/constants/suspended-account-repository.constant';

@Module({
  imports: [TypeOrmModule.forFeature([SuspendedAccountEntity])],
  providers: [
    {
      provide: SUSPENDED_ACCOUNT_REPOSITORY,
      useClass: SuspendedAccountRepository,
    },
  ],
  exports: [SUSPENDED_ACCOUNT_REPOSITORY],
})
export class SuspendedAccountModule {}
