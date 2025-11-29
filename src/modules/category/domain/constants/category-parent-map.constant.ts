import { CategoryTypeEnum } from "../enums/category-type.enum";

export const CATEGORY_PARENT_MAP = Object.freeze({
  [CategoryTypeEnum.CATEGORY]: null,
  [CategoryTypeEnum.SUB_CATEGORY]: CategoryTypeEnum.CATEGORY,
  [CategoryTypeEnum.TOPIC]: CategoryTypeEnum.SUB_CATEGORY,
});