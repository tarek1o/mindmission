import { Entity, Column, DeepPartial } from "typeorm";
import { NotificationChannelEnum } from "src/modules/notification/domain/enums/notification-channel.enum";
import { BaseEntity } from "src/modules/shared/infrastructure/database/entities/base.entity";
import { SuspendedReasonEnum } from "src/modules/suspended-account/domain/enums/suspended-reason.enum";

@Entity({ name: 'suspended_accounts' })
export class SuspendedAccountEntity extends BaseEntity {
  @Column({ name: 'recipient', type: 'varchar', length: 255 })
  recipient: string;

  @Column({ name: 'channel', type: 'varchar', length: 255 })
  channel: NotificationChannelEnum;

  @Column({ name: 'reason', type: 'varchar', length: 255 })
  reason: SuspendedReasonEnum;

  @Column({ name: 'suspended_until', type: 'timestamp' })
  suspendedUntil: Date;

  constructor(partial?: DeepPartial<SuspendedAccountEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}