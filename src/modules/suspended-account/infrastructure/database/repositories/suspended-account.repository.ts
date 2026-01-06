import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, MoreThan, LessThanOrEqual } from 'typeorm';
import { ISuspendedAccountRepository } from 'src/modules/suspended-account/application/interfaces/suspended-account-repository.interface';
import { SuspendedAccountEntity } from '../entities/suspended-account.entity';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { SuspendedAccountModel } from 'src/modules/suspended-account/domain/models/suspended-account.model';
import { SuspendedReasonEnum } from 'src/modules/suspended-account/domain/enums/suspended-reason.enum';
import { SuspendedAccountMapper } from '../mapper/suspended-account.mapper';

@Injectable()
export class SuspendedAccountRepository implements ISuspendedAccountRepository {
  constructor(
    @InjectRepository(SuspendedAccountEntity)
    private readonly repository: Repository<SuspendedAccountEntity>,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  async getByRecipientAndChannel(
    recipient: string,
    reason: SuspendedReasonEnum,
  ): Promise<SuspendedAccountModel | null> {
    const suspendedAccount = await this.repository.findOne({
      where: {
        recipient,
        reason,
        suspendedUntil: MoreThan(new Date()), // No need to accept this in the parameters
      },
    });
    return suspendedAccount
      ? SuspendedAccountMapper.toModel(suspendedAccount)
      : null;
  }

  async save(
    suspendedAccount: SuspendedAccountModel,
    manager?: EntityManager,
  ): Promise<SuspendedAccountModel> {
    const entity = SuspendedAccountMapper.toEntity(suspendedAccount);
    const repository =
      manager?.getRepository(SuspendedAccountEntity) ?? this.repository;
    const savedEntity = await repository.save(entity);
    return SuspendedAccountMapper.toModel(savedEntity);
  }

  async cleanupExpiredSuspensions(): Promise<void> {
    const result = await this.repository.delete({
      suspendedUntil: LessThanOrEqual(new Date()),
    });
    this.logger.log(
      `Deleted suspended accounts results: ${JSON.stringify(result)}`,
    );
  }

  async delete(
    suspendedAccount: SuspendedAccountModel,
    manager?: EntityManager,
  ): Promise<void> {
    const repository =
      manager?.getRepository(SuspendedAccountEntity) ?? this.repository;
    await repository.delete(suspendedAccount.id);
  }
}
