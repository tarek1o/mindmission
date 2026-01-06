import { UserTypeEnum } from 'src/modules/user/domain/enums/user-type.enum';

export type AccessTokenPayload = {
  id: number;
  firstName: string;
  lastName: string;
  types: UserTypeEnum[];
  roles: number[];
};
