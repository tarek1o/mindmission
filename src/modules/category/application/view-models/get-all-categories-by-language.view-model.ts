import { CategoryTypeEnum } from '../../domain/enums/category-type.enum';

export interface GetAllCategoriesByLanguageViewModel {
  id: number;
  name: string;
  description: string | null;
  type: CategoryTypeEnum;
  createdAt: Date;
  updatedAt: Date;
}
