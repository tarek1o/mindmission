import { InputType, Field, Int } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoleTranslationInputType } from './role-translation.input';
import { RoleInput } from 'src/modules/role/application/inputs/role.input';
import { ValidateArabicAndEnglishTranslationsExistValidator } from 'src/modules/shared/presentation/validators/validate-arabic-and-english-translations-exist.validator';

@InputType()
export class CreateRoleInput implements RoleInput {
  @Validate(ValidateArabicAndEnglishTranslationsExistValidator)
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => RoleTranslationInputType)
  @IsNotEmpty()
  @Field(() => [RoleTranslationInputType])
  translations: RoleTranslationInputType[];

  @Field(() => [Int])
  @Min(1, { each: true })
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  permissionIds: number[];
}
