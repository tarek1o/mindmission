import { BaseModel } from "src/modules/shared/domain/models/base.model";
import { RoleProps } from "../interfaces/role-props.interface";
import { ProtectedResourceError } from "src/modules/shared/domain/errors/protected-resource.error";
import { PermissionModel } from "src/modules/permission/domain/models/permission.model";
import { InvalidInputError } from "src/modules/shared/domain/errors/invalid-input.error";

export class RoleModel extends BaseModel {
  private _permissions: PermissionModel[];
  arePermissionsEditable: boolean = true;
  isDeletable: boolean = true;
  
  constructor(props: RoleProps) {
    super(props);
    this.permissions = props.permissions;
    this.arePermissionsEditable = props.arePermissionsEditable ?? this.arePermissionsEditable;
    this.isDeletable = props.isDeletable ?? this.isDeletable;
  }

  set permissions(props: PermissionModel[]) {
    if(!props?.length) {
      throw new InvalidInputError('role.permissions.empty');
    }
    if(!this.arePermissionsEditable) {
      throw new ProtectedResourceError('role.permissions.not_editable')
    }
    this._permissions = props;
  }

  get permissions(): PermissionModel[] {
    return this._permissions; 
  }

  get level(): number {
    return this.permissions.reduce((acc, curr) => acc | curr.level, 0);
  }

  override update(props: Partial<RoleProps>): void {
    super.update(props);
    this.arePermissionsEditable = props.arePermissionsEditable ?? this.arePermissionsEditable;
    this.permissions = props.permissions ?? this.permissions;
    this.isDeletable = props.isDeletable ?? this.isDeletable;
  }

  override markAsDeleted(): void {
    if (!this.isDeletable) {
      throw new ProtectedResourceError('role.not_deletable', { id: this.id });
    }
    super.markAsDeleted();
  }
}