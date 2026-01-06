import { BaseModel } from './base.model';
import { LanguageEnum } from '../enums/language.enum';
import { InvalidInputError } from '../errors/invalid-input.error';
import { BaseTranslationProps } from '../interfaces/base-translation-props.interface';

export abstract class BaseTranslationModel extends BaseModel {
  private _language: LanguageEnum;
  private _name: string;
  private _description: string | null;

  constructor(props: BaseTranslationProps) {
    super(props);
    this.language = props.language;
    this.name = props.name;
    this.description = props.description;
  }

  set language(value: LanguageEnum) {
    const languages = Object.values(LanguageEnum);
    if (!languages.includes(value)) {
      throw new InvalidInputError('global.translations.language.invalid', {
        languages,
      });
    }
    this._language = value;
  }

  get language(): LanguageEnum {
    return this._language;
  }

  set name(value: string) {
    const nameLength = value?.trim().length;
    if (!nameLength || nameLength < 3 || nameLength > 60) {
      throw new InvalidInputError(
        'global.translations.name.too_short_too_long',
        { min: 3, max: 60 },
      );
    }
    this._name = value.trim();
  }

  get name(): string {
    return this._name;
  }

  set description(description: string | null) {
    if (description && description.length > 2000) {
      throw new InvalidInputError('global.translations.description.too_long', {
        max: 2000,
      });
    }
    this._description = description ?? null;
  }

  get description(): string | null {
    return this._description;
  }

  override update(props: Partial<BaseTranslationProps>): void {
    super.update(props);
    this.language = props.language ?? this.language;
    this.name = props.name ?? this.name;
    this.description = props.description ?? this.description;
  }
}
