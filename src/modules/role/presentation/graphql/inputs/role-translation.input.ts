import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { RoleTranslationInput } from 'src/modules/role/application/inputs/role-translation.input';

@InputType()
export class RoleTranslationInputType implements RoleTranslationInput {
  @IsEnum(LanguageEnum)
  @IsNotEmpty()
  @Field(() => LanguageEnum)
  language: LanguageEnum;

  @MaxLength(60)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @MaxLength(2000)
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}

