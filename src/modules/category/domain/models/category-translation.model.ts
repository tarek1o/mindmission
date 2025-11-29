import { InvalidInputError } from "src/modules/shared/domain/errors/invalid-input.error";
import { BaseTranslationModel } from "src/modules/shared/domain/models/base-translation.model";
import { CategoryTranslationProps } from "../interfaces/category-translation.props.interface";

export class CategoryTranslationModel extends BaseTranslationModel {
  private _categoryId: number;

  constructor(props: CategoryTranslationProps) {
    super(props);
    this.categoryId = props.categoryId;
  }

  private set categoryId(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new InvalidInputError('category.translations.category_id.invalid');
    }
    this._categoryId = value;
  }

  get categoryId(): number {
    return this._categoryId;
  }
}
