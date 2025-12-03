import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import { ActionDependencies } from 'src/modules/permission/domain/constants/action-dependencies-map.constant';

@ValidatorConstraint()
export class ValidateActionsDependenciesValidator implements ValidatorConstraintInterface {
  private targetAction: ActionEnum;
  private missingDeps: ActionEnum[];

  validate(actions: ActionEnum[], validationArguments?: ValidationArguments): boolean {
    for (const action of actions) {
      const required = ActionDependencies[action] ?? [];
      const missingDeps = required.filter(dep => !actions.includes(dep));
      if (missingDeps.length > 0) {
        this.targetAction = action;
        this.missingDeps = missingDeps;
        return false;
      }
    }
    return true;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return i18nValidationMessage('errors.permission.actions.missing_dependencies', {
      action: this.targetAction,
      missing: this.missingDeps.join(', ')
    })(validationArguments);
  }
  
}
