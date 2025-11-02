import { NotificationMessage } from "../../../../notification/application/messages/notification.message";

export class EmailVerificationNotificationMessage extends NotificationMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  expirationDate: Date;
  
  constructor(data: EmailVerificationNotificationMessage) {
    super();
    Object.assign(this, data);
  }
}