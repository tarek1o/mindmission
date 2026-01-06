import { CreateUserProps } from './create-user.props.interface';

export interface UpdateUserProps extends Partial<
  Omit<
    CreateUserProps,
    | 'email'
    | 'isEmailVerified'
    | 'password'
    | 'isPasswordSet'
    | 'lastUpdatePasswordTime'
    | 'isBlocked'
  >
> {}
