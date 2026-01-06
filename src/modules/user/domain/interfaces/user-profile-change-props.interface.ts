import { BaseModelProps } from 'src/modules/shared/domain/interfaces/base-model-props.interface';
import { UserProfileFieldEnum } from '../enums/user-profile-field.enum';
import { RequestStatusEnum } from '../enums/request-status.enum';

export interface UserProfileChangeProps extends BaseModelProps {
  userId: number;
  field: UserProfileFieldEnum;
  oldValue: string;
  newValue: string;
  status?: RequestStatusEnum;
  statusChangedAt?: Date;
}
