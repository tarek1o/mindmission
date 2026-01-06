import { UserTypeEnum } from 'src/modules/user/domain/enums/user-type.enum';
import { PermissionCacheViewModel } from 'src/modules/permission/application/view-models/permission-cache.view-model';

export interface UserSession {
  id: number;
  firstName: string;
  lastName: string;
  types: UserTypeEnum[];
  roles: {
    id: number;
    permissions: PermissionCacheViewModel[];
    isDeletable: boolean;
  }[];
}
