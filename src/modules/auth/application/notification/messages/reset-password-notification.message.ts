import { NotificationMessage } from "../../../../notification/application/messages/notification.message";
import { UserTypeEnum } from "src/modules/user/domain/enums/user-type.enum";

export class ResetPasswordNotificationMessage extends NotificationMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userTypes: UserTypeEnum[];
  token: string;
  expirationDate: Date;

  constructor(data: ResetPasswordNotificationMessage) {
    super();
    Object.assign(this, data);
  }
}