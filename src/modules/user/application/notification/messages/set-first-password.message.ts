import { NotificationMessage } from "src/modules/notification/application/messages/notification.message";

export class SetFirstPasswordNotificationMessage extends NotificationMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;

  constructor(data: SetFirstPasswordNotificationMessage) {
    super();
    Object.assign(this, data);
  }
}