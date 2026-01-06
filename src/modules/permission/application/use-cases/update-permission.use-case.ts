import { Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { PERMISSION_CACHE } from '../constants/permission-cache.constant';
import { IPermissionCacheService } from '../interfaces/permission-cache-service.interface';
import { PermissionModel } from '../../domain/models/permission.model';
import { GetPermissionWithTranslationsByIdUseCase } from './get-permission-with-translations-by-id.use-case';
import { PermissionValidationService } from '../services/permission-validation.service';
import { PermissionInput } from '../inputs/permission.input';
import { PermissionTranslationInput } from '../inputs/permission-translation.input';
import { PermissionTranslationModel } from '../../domain/models/permission-translation.model';
import { PermissionWithTranslationsViewModel } from '../view-models/permission-with-translations.view-model';
import { PERMISSION_REPOSITORY } from '../constants/permission-repository.constant';
import { IPermissionRepository } from '../interfaces/permission-repository.interface';
import { PERMISSION_TRANSLATION_REPOSITORY } from '../constants/permission-translation-repository.constant';
import { IPermissionTranslationRepository } from '../interfaces/permission-translation-repository.interface';
import { PermissionCacheMapper } from '../mappers/permission-cache.mapper';
import { PermissionFinderService } from '../services/permission-finder.service';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    private readonly permissionFinderService: PermissionFinderService,
    private readonly permissionValidationService: PermissionValidationService,
    @Inject(PERMISSION_REPOSITORY)
    private permissionRepository: IPermissionRepository,
    @Inject(PERMISSION_TRANSLATION_REPOSITORY)
    private permissionTranslationRepository: IPermissionTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(PERMISSION_CACHE)
    private readonly cacheService: IPermissionCacheService,
  ) {}

  private upsertTranslations(
    translations: PermissionTranslationModel[],
    translationProps: PermissionTranslationInput[],
  ): PermissionTranslationModel[] {
    const updatedTranslations: PermissionTranslationModel[] = [];
    const translationMap = new Map(translations.map((t) => [t.language, t]));
    const permissionId = translations[0].permissionId;
    translationProps.forEach((props) => {
      const existingTranslation = translationMap.get(props.language);
      if (existingTranslation) {
        existingTranslation.update(props);
        updatedTranslations.push(existingTranslation);
      } else {
        updatedTranslations.push(
          new PermissionTranslationModel({
            ...props,
            permissionId,
          }),
        );
      }
    });
    return updatedTranslations;
  }

  private save(
    permissionModel: PermissionModel,
    upsertTranslationsModels: PermissionTranslationModel[],
    deletedTranslationsModels: PermissionTranslationModel[],
  ): Promise<PermissionWithTranslationsViewModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const permission = await this.permissionRepository.save(
        permissionModel,
        manager,
      );
      const translations = await this.permissionTranslationRepository.saveMany(
        upsertTranslationsModels,
        manager,
      );
      deletedTranslationsModels.length &&
        (await this.permissionTranslationRepository.deleteMany(
          deletedTranslationsModels,
          manager,
        ));
      return {
        permission,
        translations,
      };
    });
  }

  private async validate(
    permission: PermissionModel,
    newTranslationsModels: PermissionTranslationModel[],
  ): Promise<void> {
    const validationInput = {
      resource: permission.resource,
      actions: permission.actions,
      translations: newTranslationsModels.map((t) => ({
        language: t.language,
        name: t.name,
      })),
    };
    await this.permissionValidationService.validate(
      validationInput,
      permission.id,
    );
  }

  private getDeletedTranslations(
    currentTranslations: PermissionTranslationModel[],
    newTranslations: PermissionTranslationModel[],
  ): PermissionTranslationModel[] {
    return currentTranslations.filter(
      (t) => !newTranslations.some((t2) => t2.language === t.language),
    );
  }

  private recacheUpdatedPermission(permission: PermissionModel): Promise<void> {
    const permissionCacheViewModel =
      PermissionCacheMapper.toCacheViewModel(permission);
    return this.cacheService.saveOne(permissionCacheViewModel);
  }

  async execute(
    id: number,
    input: Partial<PermissionInput>,
  ): Promise<PermissionWithTranslationsViewModel> {
    const { permission, translations } =
      await this.permissionFinderService.getWithTranslationsById(id);
    permission.update(input);
    const newTranslationsModels = this.upsertTranslations(
      translations,
      input.translations,
    );
    await this.validate(permission, newTranslationsModels);
    const deletedTranslations = this.getDeletedTranslations(
      translations,
      newTranslationsModels,
    );
    const permissionWithTranslationsViewModel = await this.save(
      permission,
      newTranslationsModels,
      deletedTranslations,
    );
    await this.recacheUpdatedPermission(permission);
    return permissionWithTranslationsViewModel;
  }
}
