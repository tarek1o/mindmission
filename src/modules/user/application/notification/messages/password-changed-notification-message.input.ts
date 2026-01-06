import { NotificationMessage } from '../../../../notification/application/messages/notification.message';

export class PasswordChangedNotificationMessage extends NotificationMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(data: PasswordChangedNotificationMessage) {
    super();
    Object.assign(this, data);
  }
}
