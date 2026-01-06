import { BaseModel } from 'src/modules/shared/domain/models/base.model';
import { UserProfileFieldEnum } from '../enums/user-profile-field.enum';
import { RequestStatusEnum } from '../enums/request-status.enum';
import { UserProfileChangeProps } from '../interfaces/user-profile-change-props.interface';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';

export class UserProfileChangeModel extends BaseModel {
  userId: number;
  field: UserProfileFieldEnum;
  private _oldValue: string;
  private _newValue: string;
  private _status: RequestStatusEnum;
  statusChangedAt: Date | null;

  constructor(props: UserProfileChangeProps) {
    super(props);
    this.userId = props.userId;
    this.field = props.field;
    this.oldValue = props.oldValue;
    this.newValue = props.newValue;
    this.status = props.status ?? RequestStatusEnum.PENDING;
    this.statusChangedAt = props.statusChangedAt ?? null;
  }

  private checkOldValueAndNewValueEquality(oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      throw new ConflictError('user_profile_change.new_value.invalid');
    }
  }

  set oldValue(value: string) {
    this.checkOldValueAndNewValueEquality(value, this.newValue);
    this._oldValue = value;
  }

  get oldValue(): string {
    return this._oldValue;
  }

  set newValue(value: string) {
    this.checkOldValueAndNewValueEquality(this.oldValue, value);
    this._newValue = value;
  }

  get newValue(): string {
    return this._newValue;
  }

  private set status(value: RequestStatusEnum) {
    this._status = value;
  }

  get status(): RequestStatusEnum {
    return this._status;
  }

  isStatusPending() {
    return this.status === RequestStatusEnum.PENDING;
  }

  markAsConfirmed(): void {
    this.status = RequestStatusEnum.CONFIRMED;
    this.statusChangedAt = new Date();
  }

  markAsCancelled() {
    this.status = RequestStatusEnum.CANCELLED;
    this.statusChangedAt = new Date();
  }

  override update(props: Partial<UserProfileChangeProps>): void {
    super.update(props);
    this.userId = props.userId ?? this.userId;
    this.field = props.field ?? this.field;
    this.oldValue = props.oldValue ?? this.oldValue;
    this.newValue = props.newValue ?? this.newValue;
  }
}
