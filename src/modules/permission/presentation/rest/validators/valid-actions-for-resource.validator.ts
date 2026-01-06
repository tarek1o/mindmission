import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import { ResourceActionsMap } from 'src/modules/permission/domain/constants/resource-actions-map.constant';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { CreatePermissionDto } from '../dto/request/create-permission.dto';

@ValidatorConstraint()
export class ValidActionsForResourceValidator implements ValidatorConstraintInterface {
  private resource: ResourceEnum;
  private allowedActions: ActionEnum[];

  validate(
    actions: ActionEnum[],
    validationArguments?: ValidationArguments,
  ): boolean {
    const { resource } = validationArguments.object as CreatePermissionDto;
    this.resource = resource;
    this.allowedActions = ResourceActionsMap[resource] ?? [];
    return actions?.every((action) => this.allowedActions?.includes(action));
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return i18nValidationMessage('errors.permission.actions.invalid', {
      resource: this.resource,
      actions: this.allowedActions.join(', '),
    })(validationArguments);
  }
}
