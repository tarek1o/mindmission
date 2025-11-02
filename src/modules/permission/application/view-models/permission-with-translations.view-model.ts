import { PermissionModel } from "../../domain/models/permission.model";
import { PermissionTranslationModel } from "../../domain/models/permission-translation.model";

export interface PermissionWithTranslationsViewModel {
  permission: PermissionModel;
  translations: PermissionTranslationModel[];
}