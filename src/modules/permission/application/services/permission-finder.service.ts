import { Inject, Injectable } from '@nestjs/common';
import { PERMISSION_REPOSITORY } from '../constants/permission-repository.constant';
import { IPermissionRepository } from '../interfaces/permission-repository.interface';
import { PermissionWithTranslationsViewModel } from '../view-models/permission-with-translations.view-model';
import { ResourceNotFoundError } from 'src/modules/shared/domain/errors/resource-not-found.error';

@Injectable()
export class PermissionFinderService {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async getWithTranslationsById(
    id: number,
  ): Promise<PermissionWithTranslationsViewModel> {
    const permissionWithTranslationsViewModel =
      await this.permissionRepository.getWithTranslationsById(id);
    if (!permissionWithTranslationsViewModel) {
      throw new ResourceNotFoundError('permission.not_found', { id });
    }
    return permissionWithTranslationsViewModel;
  }
}
