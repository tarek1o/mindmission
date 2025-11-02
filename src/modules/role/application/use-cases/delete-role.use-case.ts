import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { ROLE_REPOSITORY } from "../constants/role-repository.constant";
import { RoleFinderService } from "../services/role-finder.service";
import { IRoleRepository } from "../interfaces/role-repository.interface";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { ROLE_CACHE } from "../constants/role-cache.constant";
import { IRoleCacheService } from "../interfaces/role-cache.service.interface";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { RoleModel } from "../../domain/models/role.model";
import { RoleTranslationModel } from "../../domain/models/role-translation.model";
import { ROLE_TRANSLATION_REPOSITORY } from "../constants/role-translation-repository.constant";
import { IRoleTranslationRepository } from "../interfaces/role-translation-repository.interface";
import { BusinessRuleViolationError } from "src/modules/shared/domain/errors/business-rule-violation.error";

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    private readonly roleFinderService: RoleFinderService,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(ROLE_TRANSLATION_REPOSITORY) private readonly roleTranslationRepository: IRoleTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(ROLE_CACHE) private readonly cacheService: IRoleCacheService,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  private async checkIfUserHasOnlyThisRole(roleId: number): Promise<void> {
    const count = await this.roleRepository.countUsersWithOnlyRole(roleId);
    if(count) {
      this.loggerService.error(`The role with id: ${roleId} is used in a user and this user has this role only`);
      throw new BusinessRuleViolationError('role.user_has_only_this_role', { id: roleId });
    }
  }

  private save(role: RoleModel, translations: RoleTranslationModel[]): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.roleRepository.save(role, manager);
      await this.roleTranslationRepository.saveMany(translations, manager);
    });
  }

  async execute(id: number): Promise<void> {
    const { role, translations} = await this.roleFinderService.getWithTranslationsById(id);
    await this.checkIfUserHasOnlyThisRole(id);
    role.markAsDeleted();
    translations.forEach(translation => translation.markAsDeleted());
    await this.save(role, translations);
    await this.cacheService.deleteOne(id);
  }
}
