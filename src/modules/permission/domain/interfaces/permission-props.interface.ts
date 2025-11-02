import { BaseModelProps } from 'src/modules/shared/domain/interfaces/base-model-props.interface';
import { ActionEnum } from '../enums/action.enum';
import { ResourceEnum } from '../enums/resource.enum';

export interface PermissionProps extends BaseModelProps {
  resource: ResourceEnum;
  actions: ActionEnum[];
  isResourceAndActionsEditable?: boolean;
  isDeletable?: boolean;
}
