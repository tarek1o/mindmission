import { BaseModel } from "src/modules/shared/domain/models/base.model";
import { CategoryTypeEnum } from "../enums/category-type.enum";
import { CategoryProps } from "../interfaces/category-props.interface";
import { InvalidInputError } from "src/modules/shared/domain/errors/invalid-input.error";
import { CATEGORY_PARENT_MAP } from "../constants/category-parent-map.constant";

export class CategoryModel extends BaseModel {
  type: CategoryTypeEnum;
  private _parentId: number | null;

  constructor(props: CategoryProps) {
    super(props);
    this.type = props.type;
    this.parentId = props.parentId;
  }
  
  isRoot(): boolean {
    return this.type === CategoryTypeEnum.CATEGORY;
  }
  
  set parentId(value: number | null) {
    if (!value && !this.isRoot()) {
      throw new InvalidInputError('category.parent_id.required', { type: this.type, parent: CATEGORY_PARENT_MAP[this.type] });
    }
    if (value && this.isRoot()) {
      throw new InvalidInputError('category.parent_id.not_allowed', { type: this.type });
    }
    this._parentId = value;
  }

  get parentId(): number | null {
    return this._parentId;
  }

  override update(props: Partial<CategoryProps>): void {
    super.update(props);
    this.type = props.type ?? this.type;
    this.parentId = props.parentId;
  }
}