import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryInput } from 'src/modules/category/application/inputs/category.input';
import { CategoryTypeEnum } from 'src/modules/category/domain/enums/category-type.enum';
import { CategoryTranslationDto } from './category-translation.dto';
import { CATEGORY_PARENT_MAP } from 'src/modules/category/domain/constants/category-parent-map.constant';

export class CreateCategoryDto implements CategoryInput {
  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum;

  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  @ArrayMinSize(2)
  @IsArray()
  @IsNotEmpty()
  translations: CategoryTranslationDto[];

  @Min(1)
  @IsInt()
  @ValidateIf((object) => !!CATEGORY_PARENT_MAP[object.type])
  parentId?: number | null;
}
