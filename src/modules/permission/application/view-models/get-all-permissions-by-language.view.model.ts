import { ResourceEnum } from "../../domain/enums/resource.enum";
import { ActionEnum } from "../../domain/enums/action.enum";

export interface GetAllPermissionsByLanguageViewModel {
  id: number;
  name: string;
  description: string;
  resource: ResourceEnum;
  actions: ActionEnum[];
  level: number;
  isDeletable: boolean;
  createdAt: Date;
  updatedAt: Date;
}