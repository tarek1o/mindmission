import { BaseModelProps } from 'src/modules/shared/domain/interfaces/base-model-props.interface';
import { CategoryTypeEnum } from '../enums/category-type.enum';

export interface CategoryProps extends BaseModelProps {
  type: CategoryTypeEnum;
  parentId: number | null;
}
