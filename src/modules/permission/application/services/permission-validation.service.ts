import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { PERMISSION_REPOSITORY } from '../constants/permission-repository.constant';
import { IPermissionRepository } from '../interfaces/permission-repository.interface';
import { PERMISSION_TRANSLATION_REPOSITORY } from '../constants/permission-translation-repository.constant';
import { IPermissionTranslationRepository } from '../interfaces/permission-translation-repository.interface';
import { PermissionProps } from '../../domain/interfaces/permission-props.interface';
import { PermissionTranslationInput } from '../inputs/permission-translation.input';
import { GetPermissionTranslationByNameViewModel } from '../view-models/get-permission-translation-by-name.view-model';
import { PermissionInput } from '../inputs/permission.input';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { InvalidInputError } from 'src/modules/shared/domain/errors/invalid-input.error';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';

@Injectable()
export class PermissionValidationService {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(PERMISSION_TRANSLATION_REPOSITORY)
    private readonly permissionTranslationRepository: IPermissionTranslationRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  private checkEnglishAndArabicTranslations(
    translations: PermissionTranslationInput[],
  ): void {
    const translationMap = new Map(
      translations.map((translation) => [translation.language, translation]),
    );
    if (
      !translationMap.has(LanguageEnum.ENGLISH) ||
      !translationMap.has(LanguageEnum.ARABIC)
    ) {
      this.logger.error(
        'Permission translations missing',
        PermissionValidationService.name,
      );
      throw new InvalidInputError('permission.translations.missing');
    }
  }

  private checkDuplicateNames(
    duplicates: GetPermissionTranslationByNameViewModel[],
  ): void {
    if (duplicates.length) {
      const repeatedNames = Array.from(
        duplicates.map(({ name }) => `'${name}'`),
      );
      const errorCode = `permission.translations.name.${repeatedNames.length > 1 ? 'multi_duplicate' : 'single_duplicate'}`;
      throw new ConflictError(errorCode, {
        duplicate: repeatedNames.join(', '),
      });
    }
  }

  private async checkPermissionNamesDuplicate(
    translationsProps: PermissionTranslationInput[],
    permissionId?: number,
  ) {
    const parameters = translationsProps.map(({ language, name }) => ({
      language,
      name,
    }));
    const permissionTranslations =
      await this.permissionTranslationRepository.getByNameAndLanguageExcludingPermissionId(
        parameters,
        permissionId,
      );
    this.checkDuplicateNames(permissionTranslations);
  }

  private async checkPermissionResourceActionsDuplicate(
    permissionProps: PermissionProps,
    permissionId?: number,
  ) {
    const { resource, actions } = permissionProps;
    const duplicateCount =
      await this.permissionRepository.getCountByResourceAndActions(
        resource,
        actions,
        permissionId,
      );
    if (duplicateCount) {
      throw new ConflictError('permission.resource_actions.duplicate');
    }
  }

  async validate(
    permissionInput: PermissionInput,
    permissionId?: number,
  ): Promise<void> {
    this.checkEnglishAndArabicTranslations(permissionInput.translations);
    await Promise.all([
      this.checkPermissionNamesDuplicate(
        permissionInput.translations,
        permissionId,
      ),
      this.checkPermissionResourceActionsDuplicate(
        permissionInput,
        permissionId,
      ),
    ]);
  }
}
