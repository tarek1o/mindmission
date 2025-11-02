import { ActionEnum } from "src/modules/permission/domain/enums/action.enum";
import { ResourceEnum } from "src/modules/permission/domain/enums/resource.enum";
import { UserTypeEnum } from "src/modules/user/domain/enums/user-type.enum";
import { UserModel } from "src/modules/user/domain/models/user.model";

export class UserDetailsResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  types: UserTypeEnum[];
  mobilePhone: string;
  whatsAppNumber: string;
  picture: string | null;
  roles: {
    id: number;
    level: number;
    permissions: {
      id: number;
      resource: ResourceEnum;
      actions: ActionEnum[];
      level: number;
    }[];
  }[];
  isProtected: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserModel) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.types = user.types;
    this.mobilePhone = user.mobilePhone;
    this.whatsAppNumber = user.whatsAppNumber;
    this.picture = user.picture;
    this.roles = user.roles.map((role) => ({
      id: role.id,
      level: role.level,
      permissions: role.permissions.map((permission) => ({
        id: permission.id,
        resource: permission.resource,
        actions: permission.actions,
        level: permission.level,
      })),
    }));
    this.isProtected = user.isProtected;
    this.isBlocked = user.isBlocked;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}