import { Column, DeepPartial, Entity } from "typeorm";
import { BaseEntity } from "src/modules/shared/infrastructure/database/entities/base.entity";
import { NotificationChannelEnum } from "src/modules/notification/domain/enums/notification-channel.enum";
import { NotificationStatusEnum } from "src/modules/notification/domain/enums/notification-status.enum";

@Entity({ name: 'notifications' })
export class NotificationEntity extends BaseEntity {
  @Column({ name: 'channel', type: 'varchar', length: 255 })
  channel: NotificationChannelEnum;

  @Column({ name: 'to', type: 'varchar', length: 255 })
  to: string;

  @Column({ name: 'subject', type: 'varchar', length: 150 })
  subject: string;

  @Column({ name: 'template', type: 'varchar', length: 150 })
  template: string;

  @Column({ name: 'context', type: 'jsonb' })
  context: Record<string, unknown>;

  @Column({ name: 'message_id', type: 'varchar', length: 150, nullable: true })
  messageId: string | null;

  @Column({ name: 'status', type: 'varchar', length: 255 })
  status: NotificationStatusEnum;

  constructor(notification?: DeepPartial<NotificationEntity>) {
    super(notification);
    Object.assign(this, notification);
  }
}
