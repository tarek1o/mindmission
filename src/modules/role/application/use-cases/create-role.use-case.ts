import { Inject, Injectable } from "@nestjs/common";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { RoleValidationService } from "../services/role-validation.service";
import { ROLE_CACHE } from "../constants/role-cache.constant";
import { IRoleCacheService } from "../interfaces/role-cache.service.interface";
import { RoleInput } from "../inputs/role.input";
import { RoleModel } from "../../domain/models/role.model";
import { RoleTranslationModel } from "../../domain/models/role-translation.model";
import { RoleWithTranslationsViewModel } from "../view-models/role-with-translations.view-model";
import { ROLE_REPOSITORY } from "../constants/role-repository.constant";
import { IRoleRepository } from "../interfaces/role-repository.interface";
import { ROLE_TRANSLATION_REPOSITORY } from "../constants/role-translation-repository.constant";
import { IRoleTranslationRepository } from "../interfaces/role-translation-repository.interface";
import { RoleCacheMapper } from "../mappers/role-cache.mapper";
import { PermissionModel } from "src/modules/permission/domain/models/permission.model";
import { RoleTranslationInput } from "../inputs/role-translation.input";

@Injectable()
export class CreateRoleUseCase {
  constructor(
    private readonly roleValidationService: RoleValidationService,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(ROLE_TRANSLATION_REPOSITORY) private readonly roleTranslationRepository: IRoleTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(ROLE_CACHE) private readonly cacheService: IRoleCacheService,
  ) {}

  private buildRoleTranslationModels(translations: RoleTranslationInput[], roleId: number): RoleTranslationModel[] {
    return translations.map(translation => new RoleTranslationModel({
      ...translation,
      roleId,
    }));
  }

  private async create(translationsInput: RoleTranslationInput[], permissions: PermissionModel[]): Promise<RoleWithTranslationsViewModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const roleModel = new RoleModel({ permissions });
      const role = await this.roleRepository.save(roleModel, manager);
      const translationsModels = this.buildRoleTranslationModels(translationsInput, role.id);
      const translations = await this.roleTranslationRepository.saveMany(translationsModels, manager);
      return { 
        role, 
        translations 
      };
    });
  }

  private cacheCreatedPermission(role: RoleModel): Promise<void> {
    const roleCacheViewModel = RoleCacheMapper.toCacheViewModel(role)
    return this.cacheService.saveOne(roleCacheViewModel);
  }

  async execute(input: RoleInput): Promise<RoleWithTranslationsViewModel> {
    // await this.roleValidationService.validate(input);
    const permissions = await this.roleValidationService.getPermissionsByIds(input.permissionIds);
    const roleWithTranslationsViewModel = await this.create(input.translations, permissions);
    await this.cacheCreatedPermission(roleWithTranslationsViewModel.role);
    return roleWithTranslationsViewModel;
  }
}
