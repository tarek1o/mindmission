import { Column, DeepPartial, Entity, Index } from 'typeorm';
import { NotificationChannelEnum } from 'src/modules/notification/domain/enums/notification-channel.enum';
import { NotificationEventEnum } from 'src/modules/notification/domain/enums/notification-event.enum';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';

@Entity({ name: 'notification_settings' })
export class NotificationSettingsEntity extends BaseEntity {
  @Index('notification_settings_notification_event_unique_index', {
    unique: true,
  })
  @Column({ name: 'notification_event', type: 'varchar', length: 255 })
  notificationEvent: NotificationEventEnum;

  @Column({ name: 'notification_channel', type: 'varchar', length: 255 })
  notificationChannel: NotificationChannelEnum;

  constructor(partial?: DeepPartial<NotificationSettingsEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
