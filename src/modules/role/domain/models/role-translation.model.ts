import { InvalidInputError } from "src/modules/shared/domain/errors/invalid-input.error";
import { BaseTranslationModel } from "src/modules/shared/domain/models/base-translation.model";
import { RoleTranslationProps } from "../interfaces/role-translation-props.interface";

export class RoleTranslationModel extends BaseTranslationModel {
  private _roleId: number;

  constructor(props: RoleTranslationProps) {
    super(props);
    this.roleId = props.roleId;
  }
  private set roleId(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new InvalidInputError('role.translations.role_id.invalid');
    }
    this._roleId = value;
  }

  get roleId(): number {
    return this._roleId;
  }
}