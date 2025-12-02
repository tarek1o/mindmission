import { NotEmptyArray } from "src/infrastructure/types/not-empty-array.type";
import { ActionEnum } from "src/modules/permission/domain/enums/action.enum";
import { ResourceEnum } from "src/modules/permission/domain/enums/resource.enum";
import { UserTypeEnum } from "src/modules/user/domain/enums/user-type.enum";

export interface IPrivilege {
  resource: ResourceEnum;
  actions: NotEmptyArray<ActionEnum>;
}

export interface IAccessPolicy {
  allowedUserTypes?: NotEmptyArray<UserTypeEnum>;
  privileges?: NotEmptyArray<IPrivilege>;
}