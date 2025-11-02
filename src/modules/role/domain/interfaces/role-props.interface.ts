import { PermissionModel } from 'src/modules/permission/domain/models/permission.model';
import { BaseModelProps } from 'src/modules/shared/domain/interfaces/base-model-props.interface';

export interface RoleProps extends BaseModelProps {
  permissions: PermissionModel[];
  arePermissionsEditable?: boolean
  isDeletable?: boolean;
}
