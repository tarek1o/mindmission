import { UserTypeEnum } from '../../domain/enums/user-type.enum';

export interface GetAllUsersQueryInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  type?: UserTypeEnum;
  mobilePhone?: string;
  whatsAppNumber?: string;
  isProtected?: boolean;
  isBlocked?: boolean;
}
