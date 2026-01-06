import { Inject, LoggerService } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../constants/role-repository.constant';
import { IRoleRepository } from '../interfaces/role-repository.interface';
import { ROLE_TRANSLATION_REPOSITORY } from '../constants/role-translation-repository.constant';
import { IRoleTranslationRepository } from '../interfaces/role-translation-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/modules/permission/application/constants/permission-repository.constant';
import { IPermissionRepository } from 'src/modules/permission/application/interfaces/permission-repository.interface';
import { PermissionModel } from 'src/modules/permission/domain/models/permission.model';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { RoleInput } from '../inputs/role.input';
import { RoleTranslationInput } from '../inputs/role-translation.input';
import { GetRoleTranslationByNameViewModel } from '../view-models/get-role-translation-by-name.view-model';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { PermissionValidationService } from 'src/modules/permission/application/services/permission-validation.service';
import { InvalidInputError } from 'src/modules/shared/domain/errors/invalid-input.error';
import { ResourceNotFoundError } from 'src/modules/shared/domain/errors/resource-not-found.error';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';

export class RoleValidationService {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    @Inject(ROLE_TRANSLATION_REPOSITORY)
    private readonly roleTranslationRepository: IRoleTranslationRepository,
  ) {}

  private checkEnglishAndArabicTranslations(
    translations: RoleTranslationInput[],
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

  private checkMissingPermissions(
    permissions: PermissionModel[],
    permissionIds: number[],
  ): void {
    const missingIds = permissionIds.filter(
      (id) => !permissions.some((p) => p.id === id),
    );
    if (missingIds.length > 0) {
      this.logger.error(
        `Permissions not found: ${missingIds.join(', ')}`,
        RoleValidationService.name,
      );
      throw new ResourceNotFoundError('role.permissions.not_found', {
        ids: missingIds.join(', '),
      });
    }
  }

  async getPermissionsByIds(
    permissionIds: number[],
  ): Promise<PermissionModel[]> {
    const permissions = await this.permissionRepository.getByIds(permissionIds);
    this.checkMissingPermissions(permissions, permissionIds);
    return permissions;
  }

  private checkDuplicateNames(
    duplicates: GetRoleTranslationByNameViewModel[],
  ): void {
    if (duplicates.length) {
      const repeatedNames = Array.from(
        duplicates.map(({ name }) => `'${name}'`),
      );
      const errorCode = `role.translations.name.${repeatedNames.length > 1 ? 'multi_duplicate' : 'single_duplicate'}`;
      throw new ConflictError(errorCode, {
        duplicate: repeatedNames.join(', '),
      });
    }
  }

  private async checkRoleNamesDuplicate(
    translations: RoleTranslationInput[],
    roleId?: number,
  ): Promise<void> {
    const parameters = translations.map(({ language, name }) => ({
      language,
      name,
    }));
    const roleTranslations =
      await this.roleTranslationRepository.getByNameAndLanguageExcludingRoleId(
        parameters,
        roleId,
      );
    this.checkDuplicateNames(roleTranslations);
  }

  private async checkRolePermissionsDuplicate(
    permissionIds: number[],
    roleId?: number,
  ): Promise<void> {
    const duplicateCount = permissionIds.length
      ? await this.roleRepository.countRolesWithPermissionsExcludingRoleId(
          permissionIds,
          roleId,
        )
      : 0;
    if (duplicateCount) {
      this.logger.error(
        `Role permissions duplicate: ${permissionIds.join(', ')}`,
        RoleValidationService.name,
      );
      throw new ConflictError('role.permissions.duplicate');
    }
  }

  async validate(input: RoleInput, roleId?: number): Promise<void> {
    this.checkEnglishAndArabicTranslations(input.translations);
    await Promise.all([
      this.checkRoleNamesDuplicate(input.translations, roleId),
      this.checkRolePermissionsDuplicate(input.permissionIds, roleId),
    ]);
  }
}
