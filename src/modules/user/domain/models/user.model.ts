import { BaseModel } from 'src/modules/shared/domain/models/base.model';
import { UserTypeEnum } from '../enums/user-type.enum';
import { RoleModel } from 'src/modules/role/domain/models/role.model';
import { InvalidInputError } from 'src/modules/shared/domain/errors/invalid-input.error';
import { CreateUserProps } from '../interfaces/create-user.props.interface';
import { UpdateUserProps } from '../interfaces/update-user-props.interface';
import { ProtectedResourceError } from 'src/modules/shared/domain/errors/protected-resource.error';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';
import { AppUiEnum } from 'src/modules/shared/domain/enums/app-ui.enum';

export class UserModel extends BaseModel {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _isEmailVerified: boolean;
  private _password: string;
  isPasswordSet: boolean;
  private _lastUpdatePasswordTime: Date | null;
  picture: string | null;
  isBlocked: boolean;
  private _types: UserTypeEnum[];
  mobilePhone: string | null;
  whatsAppNumber: string | null;
  private _roles: RoleModel[];
  isProtected: boolean;

  constructor(props: CreateUserProps) {
    super(props);
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this._isEmailVerified = props.isEmailVerified ?? false;
    this.password = props.password;
    this.isPasswordSet = props.isPasswordSet ?? true;
    this._lastUpdatePasswordTime = props.lastUpdatePasswordTime ?? null;
    this.picture = props.picture ?? null;
    this.types = props.types;
    this.mobilePhone = props.mobilePhone ?? null;
    this.whatsAppNumber = props.whatsAppNumber ?? null;
    this.roles = props.roles ?? [];
    this.isProtected = props.isProtected ?? false;
    this.isBlocked = props.isBlocked ?? false;
  }

  set firstName(value: string) {
    if (value?.length < 3 || value?.length > 60) {
      throw new InvalidInputError('user.first_name.too_short_too_long', {
        min: 3,
        max: 60,
      });
    }
    this._firstName = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set lastName(value: string) {
    if (value?.length < 3 || value?.length > 60) {
      throw new InvalidInputError('user.last_name.too_short_too_long', {
        min: 3,
        max: 60,
      });
    }
    this._lastName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  private checkIfProtected(): void {
    if (this.isProtected) {
      throw new ProtectedResourceError('user.protected', { id: this.id });
    }
  }

  private set email(value: string) {
    if (value.length < 5 || value.length > 100) {
      throw new InvalidInputError('user.email.too_short_too_long', {
        min: 5,
        max: 100,
      });
    }
    this.checkIfProtected();
    this._email = value;
  }

  get email(): string {
    return this._email;
  }

  private set isEmailVerified(value: boolean) {
    this._isEmailVerified = value;
  }

  get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  markEmailAsVerified() {
    this.isEmailVerified = true;
  }

  changeEmail(newEmail: string) {
    this.email = newEmail;
    this.isEmailVerified = false;
  }

  private set password(value: string) {
    if (value.length < 8 || value.length > 100) {
      throw new InvalidInputError('user.password.too_short_too_long', {
        min: 8,
        max: 100,
      });
    }
    this._password = value;
  }

  get password(): string {
    return this._password;
  }

  setFirstPassword(password: string): void {
    if (this.isPasswordSet) {
      throw new ConflictError('user.set_first_password');
    }
    this.changePassword(password);
    this.isPasswordSet = true;
    this.markEmailAsVerified();
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
    this.lastUpdatePasswordTime = new Date();
  }

  private set lastUpdatePasswordTime(value: Date | null) {
    this._lastUpdatePasswordTime = value;
  }

  get lastUpdatePasswordTime(): Date | null {
    return this._lastUpdatePasswordTime;
  }

  set types(values: UserTypeEnum[]) {
    if (!values?.length) {
      throw new InvalidInputError('user.types.empty');
    }
    if (values.includes(UserTypeEnum.ADMIN) && values.length > 1) {
      throw new InvalidInputError('user.types.admin_only');
    }
    this.checkIfProtected();
    this._types = values;
  }

  get types(): UserTypeEnum[] {
    return this._types;
  }

  get appUi(): AppUiEnum {
    return this.isUserIsSystemAdmin()
      ? AppUiEnum.DASHBOARD
      : AppUiEnum.MAIN_APP;
  }

  isUserIsSystemAdmin(): boolean {
    return this.types.includes(UserTypeEnum.ADMIN);
  }

  set roles(values: RoleModel[]) {
    if (!values.length && this.isUserIsSystemAdmin()) {
      throw new InvalidInputError('user.roles.empty');
    }
    this.checkIfProtected();
    this._roles = values;
  }

  get roles(): RoleModel[] {
    return this._roles;
  }

  get level(): number {
    return this.roles.reduce((acc, curr) => acc | curr.level, 0);
  }

  toggleBlock(): void {
    this.isBlocked = !this.isBlocked;
  }

  override update(props: UpdateUserProps): void {
    super.update(props);
    this.firstName = props.firstName ?? this.firstName;
    this.lastName = props.lastName ?? this.lastName;
    this.picture = props.picture;
    this.types = props.types ?? this.types;
    this.mobilePhone = props.mobilePhone;
    this.whatsAppNumber = props.whatsAppNumber;
    this.roles = props.roles ?? this.roles;
    this.isProtected = props.isProtected ?? this.isProtected;
  }

  override markAsDeleted(): void {
    if (this.isProtected) {
      throw new ProtectedResourceError('user.protected', { id: this.id });
    }
    super.markAsDeleted();
  }
}
