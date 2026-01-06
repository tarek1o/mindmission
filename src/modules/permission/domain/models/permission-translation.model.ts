import { BaseTranslationModel } from 'src/modules/shared/domain/models/base-translation.model';
import { PermissionTranslationProps } from '../interfaces/permission-translation-props.interface';
import { InvalidInputError } from 'src/modules/shared/domain/errors/invalid-input.error';

export class PermissionTranslationModel extends BaseTranslationModel {
  private _permissionId: number;

  constructor(props: PermissionTranslationProps) {
    super(props);
    this.permissionId = props.permissionId;
  }

  private set permissionId(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new InvalidInputError(
        'permission.translations.permission_id.invalid',
      );
    }
    this._permissionId = value;
  }

  get permissionId(): number {
    return this._permissionId;
  }
}
