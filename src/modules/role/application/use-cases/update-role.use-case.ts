import { Inject, Injectable } from '@nestjs/common';
import { RoleValidationService } from '../services/role-validation.service';
import { IRoleCacheService } from '../interfaces/role-cache.service.interface';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { ROLE_CACHE } from '../constants/role-cache.constant';
import { RoleModel } from '../../domain/models/role.model';
import { RoleFinderService } from '../services/role-finder.service';
import { RoleInput } from '../inputs/role.input';
import { RoleTranslationModel } from '../../domain/models/role-translation.model';
import { RoleWithTranslationsViewModel } from '../view-models/role-with-translations.view-model';
import { RoleTranslationInput } from '../inputs/role-translation.input';
import { ROLE_REPOSITORY } from '../constants/role-repository.constant';
import { IRoleRepository } from '../interfaces/role-repository.interface';
import { IRoleTranslationRepository } from '../interfaces/role-translation-repository.interface';
import { RoleCacheMapper } from '../mappers/role-cache.mapper';
import { ROLE_TRANSLATION_REPOSITORY } from '../constants/role-translation-repository.constant';

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    private readonly roleFinderService: RoleFinderService,
    private readonly validationService: RoleValidationService,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(ROLE_TRANSLATION_REPOSITORY)
    private readonly roleTranslationRepository: IRoleTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(ROLE_CACHE) private readonly cacheService: IRoleCacheService,
  ) {}

  private upsertTranslations(
    translations: RoleTranslationModel[],
    translationProps: RoleTranslationInput[],
  ): RoleTranslationModel[] {
    const updatedTranslations: RoleTranslationModel[] = [];
    const translationMap = new Map(translations.map((t) => [t.language, t]));
    const roleId = translations[0].roleId;
    translationProps.forEach((props) => {
      const existingTranslation = translationMap.get(props.language);
      if (existingTranslation) {
        existingTranslation.update(props);
        updatedTranslations.push(existingTranslation);
      } else {
        updatedTranslations.push(
          new RoleTranslationModel({
            ...props,
            roleId,
          }),
        );
      }
    });
    return updatedTranslations;
  }

  private async validate(
    id: number,
    translations: RoleTranslationModel[],
    permissionIds: number[],
  ): Promise<void> {
    const validationInput = {
      permissionIds,
      translations: translations.map((t) => ({
        language: t.language,
        name: t.name,
      })),
    };
    await this.validationService.validate(validationInput, id);
  }

  private getDeletedTranslations(
    currentTranslations: RoleTranslationModel[],
    newTranslations: RoleTranslationModel[],
  ): RoleTranslationModel[] {
    return currentTranslations.filter(
      (t) => !newTranslations.some((t2) => t2.language === t.language),
    );
  }

  private async save(
    role: RoleModel,
    translations: RoleTranslationModel[],
    deletedTranslations: RoleTranslationModel[],
  ): Promise<RoleWithTranslationsViewModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const savedRole = await this.roleRepository.save(role, manager);
      const savedTranslations = await this.roleTranslationRepository.saveMany(
        translations,
        manager,
      );
      deletedTranslations.length &&
        (await this.roleTranslationRepository.deleteMany(
          deletedTranslations,
          manager,
        ));
      return {
        role: savedRole,
        translations: savedTranslations,
      };
    });
  }

  private recacheUpdatedRole(role: RoleModel): Promise<void> {
    const roleCacheViewModel = RoleCacheMapper.toCacheViewModel(role);
    return this.cacheService.saveOne(roleCacheViewModel);
  }

  async execute(
    id: number,
    input: Partial<RoleInput>,
  ): Promise<RoleWithTranslationsViewModel> {
    const { role, translations } =
      await this.roleFinderService.getWithTranslationsById(id);
    role.permissions = input.permissionIds?.length
      ? await this.validationService.getPermissionsByIds(input.permissionIds)
      : role.permissions;
    const translationsModels = this.upsertTranslations(
      translations,
      input.translations,
    );
    await this.validate(id, translationsModels, input.permissionIds ?? []);
    const deletedTranslations = this.getDeletedTranslations(
      translations,
      translationsModels,
    );
    const roleWithTranslationsViewModel = await this.save(
      role,
      translationsModels,
      deletedTranslations,
    );
    await this.recacheUpdatedRole(roleWithTranslationsViewModel.role);
    return roleWithTranslationsViewModel;
  }
}
