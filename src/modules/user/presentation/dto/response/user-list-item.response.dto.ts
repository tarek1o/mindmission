import { UserTypeEnum } from 'src/modules/user/domain/enums/user-type.enum';
import { GetAllUsersPaginatedViewModel } from 'src/modules/user/application/view-models/get-all-users-paginated.view-model';

export class UserListItemResponseDto {
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

  constructor(user: GetAllUsersPaginatedViewModel) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.isEmailVerified = user.isEmailVerified;
    this.picture = user.picture;
    this.types = user.types;
    this.mobilePhone = user.mobilePhone;
    this.whatsAppNumber = user.whatsAppNumber;
    this.isProtected = user.isProtected;
    this.isBlocked = user.isBlocked;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
