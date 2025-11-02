import { RoleModel } from "src/modules/role/domain/models/role.model";
import { BaseModelProps } from "src/modules/shared/domain/interfaces/base-model-props.interface";
import { UserTypeEnum } from "../enums/user-type.enum";

export interface CreateUserProps extends BaseModelProps {
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified?: boolean;
  password: string;
  isPasswordSet?: boolean;
  lastUpdatePasswordTime?: Date;
  picture?: string;
  types: UserTypeEnum[]; 
  mobilePhone?: string | null;
  whatsAppNumber?: string | null;
  roles?: RoleModel[];
  isProtected?: boolean;
  isBlocked?: boolean;
}