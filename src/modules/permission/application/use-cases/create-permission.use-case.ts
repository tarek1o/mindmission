import { Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { PERMISSION_CACHE } from '../constants/permission-cache.constant';
import { IPermissionCacheService } from '../interfaces/permission-cache-service.interface';
import { PermissionInput } from '../inputs/permission.input';
import { PermissionModel } from '../../domain/models/permission.model';
import { PermissionValidationService } from '../services/permission-validation.service';
import { PermissionTranslationModel } from '../../domain/models/permission-translation.model';
import { PermissionWithTranslationsViewModel } from '../view-models/permission-with-translations.view-model';
import { PERMISSION_REPOSITORY } from '../constants/permission-repository.constant';
import { IPermissionRepository } from '../interfaces/permission-repository.interface';
import { PERMISSION_TRANSLATION_REPOSITORY } from '../constants/permission-translation-repository.constant';
import { IPermissionTranslationRepository } from '../interfaces/permission-translation-repository.interface';
import { PermissionCacheMapper } from '../mappers/permission-cache.mapper';
import { PermissionTranslationInput } from '../inputs/permission-translation.input';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(PERMISSION_TRANSLATION_REPOSITORY)
    private readonly permissionTranslationRepository: IPermissionTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    private readonly permissionValidationService: PermissionValidationService,
    @Inject(PERMISSION_CACHE)
    private readonly cacheService: IPermissionCacheService,
  ) {}

  private buildPermissionTranslationModels(
    translations: PermissionTranslationInput[],
    permissionId: number,
  ): PermissionTranslationModel[] {
    return translations.map(
      (translation) =>
        new PermissionTranslationModel({
          ...translation,
          permissionId,
        }),
    );
  }

  private create(
    input: PermissionInput,
  ): Promise<PermissionWithTranslationsViewModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const permissionModel = new PermissionModel(input);
      const permission = await this.permissionRepository.save(
        permissionModel,
        manager,
      );
      const translationsModels = this.buildPermissionTranslationModels(
        input.translations,
        permission.id,
      );
      const translations = await this.permissionTranslationRepository.saveMany(
        translationsModels,
        manager,
      );
      return {
        permission,
        translations,
      };
    });
  }

  private cacheCreatedPermission(permission: PermissionModel): Promise<void> {
    const permissionCacheViewModel =
      PermissionCacheMapper.toCacheViewModel(permission);
    return this.cacheService.saveOne(permissionCacheViewModel);
  }

  async execute(
    input: PermissionInput,
  ): Promise<PermissionWithTranslationsViewModel> {
    await this.permissionValidationService.validate(input);
    const permissionWithTranslationsViewModel = await this.create(input);
    await this.cacheCreatedPermission(
      permissionWithTranslationsViewModel.permission,
    );
    return permissionWithTranslationsViewModel;
  }
}
