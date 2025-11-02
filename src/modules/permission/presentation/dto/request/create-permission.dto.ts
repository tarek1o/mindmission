import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionInput } from 'src/modules/permission/application/inputs/permission.input';
import { PermissionTranslationDto } from './permission-translation.dto';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { ValidateArabicAndEnglishTranslationsExistValidator } from '../../../../shared/presentation/validators/validate-arabic-and-english-translations-exist.validator';
import { ValidateActionsDependenciesValidator } from '../../validators/valid-actions-dependencies.validator';
import { ValidActionsForResourceValidator } from '../../validators/valid-actions-for-resource.validator';

export class CreatePermissionDto implements PermissionInput {
  @Validate(ValidateArabicAndEnglishTranslationsExistValidator)
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @IsArray()
  @Type(() => PermissionTranslationDto)
  @IsNotEmpty()
  translations: PermissionTranslationDto[];

  @IsEnum(ResourceEnum)
  @IsNotEmpty()
  resource: ResourceEnum;

  @Validate(ValidActionsForResourceValidator)
  @Validate(ValidateActionsDependenciesValidator)
  @IsEnum(ActionEnum, { each: true })
  @IsNotEmpty()
  actions: ActionEnum[];
}
