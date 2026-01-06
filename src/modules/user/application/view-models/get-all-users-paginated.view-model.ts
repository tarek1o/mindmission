import { UserTypeEnum } from '../../domain/enums/user-type.enum';

export interface GetAllUsersPaginatedViewModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  picture?: string;
  types: UserTypeEnum[];
  mobilePhone: string | null;
  whatsAppNumber: string | null;
  isProtected: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
