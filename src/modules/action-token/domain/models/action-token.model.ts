import * as moment from 'moment';
import { BaseModel } from 'src/modules/shared/domain/models/base.model';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';
import { ActionTokenProps } from '../interfaces/action-token-props.interface';
import { TokenStrategyType } from '../../application/enums/token-strategy-type.enum';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';

export class ActionTokenModel<T = any> extends BaseModel {
  private _uuid: string;
  token: string;
  type: ActionTokenTypeEnum;
  payload: T;
  strategy: TokenStrategyType;
  userId: number | null;
  private _isRevoked?: boolean;
  private _expiresAt: Date | null;

  constructor(props: ActionTokenProps<T>) {
    super(props);
    this.token = props.token;
    this.type = props.type;
    this.strategy = props.strategy;
    this.uuid = props.uuid;
    this.payload = props.payload;
    this.userId = props.userId;
    this.isRevoked = props.isRevoked ?? undefined;
    this.expiresAt = props.expiresAt;
  }

  set uuid(value: string) {
    if (value && this.strategy === TokenStrategyType.STATELESS) {
      throw new ConflictError('action_token.uuid.not_allowed');
    }
    this._uuid = value;
  }

  get uuid(): string {
    return this._uuid;
  }

  set expiresAt(value: Date) {
    this._expiresAt = value;
  }

  get expiresAt(): Date | null {
    return this._expiresAt;
  }

  private set isRevoked(value: boolean) {
    this._isRevoked = value;
  }

  get isRevoked(): boolean {
    return this._isRevoked;
  }

  canBeRevoked(): boolean {
    return this.strategy === TokenStrategyType.STATEFUL;
  }

  markAsRevoked(): void {
    if (this.canBeRevoked()) {
      this.isRevoked = true;
    }
  }

  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  getRemainingTimeToExpired(): number | null {
    if (!this.expiresAt) {
      return null;
    }
    const diff = moment(this.expiresAt).diff(new Date(), 'second');
    return diff > 0 ? diff : 0;
  }

  override update(props: Partial<ActionTokenProps<T>>): void {
    super.update(props);
    this.token = props.token ?? this.token;
    this.type = props.type ?? this.type;
    this.payload = props.payload ?? this.payload;
    this.userId = props.userId;
    this.expiresAt = props.expiresAt ?? this.expiresAt;
  }
}
