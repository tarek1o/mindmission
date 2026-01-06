import { NotificationMessage } from '../../../../notification/application/messages/notification.message';

export class WelcomeNotificationMessage extends NotificationMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(data: WelcomeNotificationMessage) {
    super();
    Object.assign(this, data);
  }
}
