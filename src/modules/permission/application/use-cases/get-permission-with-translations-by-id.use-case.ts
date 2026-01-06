import { Injectable } from '@nestjs/common';
import { PermissionWithTranslationsViewModel } from '../view-models/permission-with-translations.view-model';
import { PermissionFinderService } from '../services/permission-finder.service';

@Injectable()
export class GetPermissionWithTranslationsByIdUseCase {
  constructor(
    private readonly permissionFinderService: PermissionFinderService,
  ) {}

  execute(id: number): Promise<PermissionWithTranslationsViewModel> {
    return this.permissionFinderService.getWithTranslationsById(id);
  }
}
