import { BaseTranslationProps } from "src/modules/shared/domain/interfaces/base-translation-props.interface";

export interface CategoryTranslationProps extends BaseTranslationProps {
  categoryId: number;
}