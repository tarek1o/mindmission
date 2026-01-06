import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { IPermissionRepository } from '../interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from '../constants/permission-repository.constant';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { PERMISSION_CACHE } from '../constants/permission-cache.constant';
import { IPermissionCacheService } from '../interfaces/permission-cache-service.interface';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { PermissionModel } from '../../domain/models/permission.model';
import { PermissionTranslationModel } from '../../domain/models/permission-translation.model';
import { IPermissionTranslationRepository } from '../interfaces/permission-translation-repository.interface';
import { PERMISSION_TRANSLATION_REPOSITORY } from '../constants/permission-translation-repository.constant';
import { BusinessRuleViolationError } from 'src/modules/shared/domain/errors/business-rule-violation.error';
import { PermissionFinderService } from '../services/permission-finder.service';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    private readonly permissionFinderService: PermissionFinderService,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(PERMISSION_TRANSLATION_REPOSITORY)
    private readonly permissionTranslationRepository: IPermissionTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(PERMISSION_CACHE)
    private readonly cacheService: IPermissionCacheService,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  private async checkIfRoleHasOnlyThisPermission(
    permissionId: number,
  ): Promise<void> {
    const count =
      await this.permissionRepository.countRolesWithOnlyPermission(
        permissionId,
      );
    if (count) {
      this.loggerService.error(
        `The permission with id: ${permissionId} is used in a role and this role has this permission only`,
      );
      throw new BusinessRuleViolationError(
        'permission.role_has_only_this_permission',
        { id: permissionId },
      );
    }
  }

  private save(
    permission: PermissionModel,
    translations: PermissionTranslationModel[],
  ): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.permissionRepository.save(permission, manager);
      await this.permissionTranslationRepository.saveMany(
        translations,
        manager,
      );
    });
  }

  async execute(id: number): Promise<void> {
    const { permission, translations } =
      await this.permissionFinderService.getWithTranslationsById(id);
    await this.checkIfRoleHasOnlyThisPermission(id);
    permission.markAsDeleted();
    translations.forEach((translation) => translation.markAsDeleted());
    await this.save(permission, translations);
    await this.cacheService.deleteOne(id);
  }
}
