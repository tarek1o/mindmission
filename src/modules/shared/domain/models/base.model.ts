import { InvalidInputError } from '../errors/invalid-input.error';
import { BaseModelProps } from '../interfaces/base-model-props.interface';

export abstract class BaseModel {
  protected _id: number;
  createdAt: Date;
  updatedAt: Date;
  protected _deletedAt: Date | null;

  constructor(props: BaseModelProps) {
    this.id = props.id ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? this.createdAt;
    this.deletedAt = props.deletedAt ?? null;
  }

  set id(value: number) {
    if ((value && (!Number.isInteger(value) || value <= 0))) {
      throw new InvalidInputError('global.base.id.invalid');
    }
    this._id = value ?? this.id;
  }

  get id(): number {
    return this._id;
  }

  private set deletedAt(value: Date | null) {
    this._deletedAt = value;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  update(props: Partial<BaseModelProps>): void {
    this.createdAt = props.createdAt ?? this.createdAt;
    this.updatedAt = props.updatedAt ?? this.createdAt;
  }

  markAsDeleted(): void {
    this.deletedAt = new Date();
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  isSavedPersisted(): boolean {
    return !!this.id;
  }

  markAsRestored(): void {
    if (this.isDeleted()) {
      this.deletedAt = null;
    }
  }
}
