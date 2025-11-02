import { SetMetadata } from "@nestjs/common";
import { IAccessPolicy } from "../interfaces/privilege.interface";

export const Privilege_Decorator_Key = "privileges";
export const AcceptedCriteria = (accessPolicies: IAccessPolicy) => SetMetadata(Privilege_Decorator_Key, accessPolicies);