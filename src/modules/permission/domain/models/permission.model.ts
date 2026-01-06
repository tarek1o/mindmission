import { ResourceEnum } from '../enums/resource.enum';
import { ActionEnum } from '../enums/action.enum';
import { ResourceActionsMap } from '../constants/resource-actions-map.constant';
import { ActionDependencies } from '../constants/action-dependencies-map.constant';
import { PermissionProps } from '../interfaces/permission-props.interface';
import { BaseModel } from 'src/modules/shared/domain/models/base.model';
import { InvalidInputError } from 'src/modules/shared/domain/errors/invalid-input.error';
import { ProtectedResourceError } from 'src/modules/shared/domain/errors/protected-resource.error';

export class PermissionModel extends BaseModel {
  private _resource: ResourceEnum;
  private _actions: ActionEnum[];
  isResourceAndActionsEditable: boolean = true;
  isDeletable: boolean = true;

  constructor(props: PermissionProps) {
    super(props);
    this.resource = props.resource;
    this.actions = props.actions;
    this.isResourceAndActionsEditable =
      props.isResourceAndActionsEditable ?? this.isResourceAndActionsEditable;
    this.isDeletable = props.isDeletable ?? this.isDeletable;
  }

  set resource(value: ResourceEnum) {
    if (!this.isResourceAndActionsEditable) {
      throw new ProtectedResourceError(
        'permission.resource_actions.not_editable',
      );
    }
    this._resource = value;
  }

  get resource(): ResourceEnum {
    return this._resource;
  }

  private checkResourceActionsMapping(
    resource: ResourceEnum,
    actions: ActionEnum[],
  ): void {
    const allowedActions = ResourceActionsMap[resource] ?? [];
    if (actions.some((value) => !allowedActions.includes(value))) {
      throw new InvalidInputError('permission.actions.invalid', {
        resource: this.resource,
        actions: actions.join(', '),
      });
    }
  }

  private checkActionsDependencies(actions: ActionEnum[]): void {
    for (const action of actions) {
      const required = ActionDependencies[action] ?? [];
      const missingDeps = required.filter((dep) => !actions.includes(dep));
      if (missingDeps.length > 0) {
        throw new InvalidInputError('permission.actions.missing_dependencies', {
          action,
          missing: missingDeps.join(', '),
        });
      }
    }
  }

  set actions(values: ActionEnum[]) {
    if (!values?.length) {
      throw new InvalidInputError('permission.actions.empty');
    }
    this.checkResourceActionsMapping(this.resource, values);
    this.checkActionsDependencies(values);
    if (!this.isResourceAndActionsEditable) {
      throw new ProtectedResourceError(
        'permission.resource_actions.not_editable',
      );
    }
    this._actions = values;
  }

  get actions(): ActionEnum[] {
    return this._actions;
  }

  get level(): number {
    const ActionBitValue: Record<ActionEnum, number> = {
      [ActionEnum.LIST]: 1 << 0, // 1
      [ActionEnum.SEARCH]: 1 << 1, // 2
      [ActionEnum.ADD]: 1 << 2, // 4
      [ActionEnum.EDIT]: 1 << 3, // 8
      [ActionEnum.DELETE]: 1 << 4, // 16
    };
    return this.actions.reduce(
      (acc, action) => acc | ActionBitValue[action],
      0,
    );
  }

  override update(props: Partial<PermissionProps>): void {
    super.update(props);
    this.isResourceAndActionsEditable =
      props.isResourceAndActionsEditable ?? this.isResourceAndActionsEditable;
    this.resource = props.resource ?? this.resource;
    this.actions = props.actions ?? this.actions;
    this.isDeletable = props.isDeletable ?? this.isDeletable;
  }

  override markAsDeleted(): void {
    if (!this.isDeletable) {
      throw new ProtectedResourceError('permission.not_deletable', {
        id: this.id,
      });
    }
    super.markAsDeleted();
  }
}
