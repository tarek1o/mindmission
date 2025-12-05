import { InputType, Field } from '@nestjs/graphql';
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
import { PermissionTranslationInputType } from './permission-translation.input';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { ValidateArabicAndEnglishTranslationsExistValidator } from 'src/modules/shared/presentation/validators/validate-arabic-and-english-translations-exist.validator';
import { ValidateActionsDependenciesValidator } from 'src/modules/permission/presentation/rest/validators/valid-actions-dependencies.validator';
import { ValidActionsForResourceValidator } from 'src/modules/permission/presentation/rest/validators/valid-actions-for-resource.validator';

@InputType()
export class CreatePermissionInput implements PermissionInput {
  @Validate(ValidateArabicAndEnglishTranslationsExistValidator)
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @IsArray()
  @Type(() => PermissionTranslationInputType)
  @IsNotEmpty()
  @Field(() => [PermissionTranslationInputType])
  translations: PermissionTranslationInputType[];

  @IsEnum(ResourceEnum)
  @IsNotEmpty()
  @Field(() => ResourceEnum)
  resource: ResourceEnum;

  @Validate(ValidActionsForResourceValidator)
  @Validate(ValidateActionsDependenciesValidator)
  @IsEnum(ActionEnum, { each: true })
  @IsNotEmpty()
  @IsArray()
  @Field(() => [ActionEnum])
  actions: ActionEnum[];
}

