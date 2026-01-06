import { LanguageEnum } from '../enums/language.enum';
import { BaseModelProps } from './base-model-props.interface';

export interface BaseTranslationProps extends BaseModelProps {
  language: LanguageEnum;
  name: string;
  description?: string;
}
