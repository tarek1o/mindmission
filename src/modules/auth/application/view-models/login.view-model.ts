import { UserModel } from 'src/modules/user/domain/models/user.model';

export interface LoginViewModel {
  user: UserModel;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
