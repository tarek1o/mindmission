import { UserTypeEnum } from "../../domain/enums/user-type.enum";
import { ResourceEnum } from "src/modules/permission/domain/enums/resource.enum";
import { ActionEnum } from "src/modules/permission/domain/enums/action.enum";

export interface UserProfileInfoViewModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  types: UserTypeEnum[];
  mobilePhone: string | null;
  whatsAppNumber: string | null;
  roles: {
    id: number;
    permissions: {
      id: number;
      resource: ResourceEnum;
      actions: ActionEnum[];
      level: number;
    }[];
  }[];
}