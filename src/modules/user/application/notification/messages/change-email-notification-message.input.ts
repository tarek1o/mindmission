import { UserTypeEnum } from 'src/modules/user/domain/enums/user-type.enum';
import { NotificationMessage } from '../../../../notification/application/messages/notification.message';

export class ChangeEmailNotificationMessage extends NotificationMessage {
  id: number;
  firstName: string;
  lastName: string;
  currentEmail: string;
  upcomingEmail: string;
  userTypes: UserTypeEnum[];
  token: string;
  expirationDate: Date;

  constructor(data: ChangeEmailNotificationMessage) {
    super();
    Object.assign(this, data);
  }
}
