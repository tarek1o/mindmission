import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';

@InputType()
export class GetAllPermissionQueryInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => ResourceEnum, { nullable: true })
  @IsEnum(ResourceEnum)
  @IsOptional()
  resource?: ResourceEnum;
}
